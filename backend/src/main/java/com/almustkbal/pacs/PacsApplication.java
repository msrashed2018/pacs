package com.almustkbal.pacs;

import java.io.IOException;
import java.net.BindException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.GeneralSecurityException;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.PreDestroy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.almustkbal.pacs.components.ActiveDicoms;
import com.almustkbal.pacs.config.DirectoryWatcherConfig;
import com.almustkbal.pacs.entities.ApplicationEntity;
import com.almustkbal.pacs.handlers.IncomingDicomFileHandler;
import com.almustkbal.pacs.server.DicomServer;
import com.almustkbal.pacs.server.DicomServerCollectionBean;
import com.almustkbal.pacs.services.ApplicationEntityService;
import com.almustkbal.pacs.services.DirectoryWatchService;
import com.google.common.eventbus.AsyncEventBus;
import com.google.common.eventbus.EventBus;

@SpringBootApplication
public class PacsApplication implements ApplicationRunner {
	private static final Logger LOG = LoggerFactory.getLogger(PacsApplication.class);

	public static Map<String, DicomServer> dicomServers = new HashMap<>();

	@Value(value = "${pacs.storage.dcm}")
	private String pacsDicomStorage;

	@Value(value = "${pacs.storage.image}")
	private String pacsImageStorage;
	
	@Value(value = "${directory.watcher.path}")
	private String directoryWatcherPath;
	
	@Value(value = "${directory.watcher.enabled}")
	private boolean directoryWatcherEnabled;
	
	@Value(value = "${directory.watcher.index-zip-files}")
	private boolean indexZipFilesEnabled;
	
	@Value(value = "${directory.watcher.save-thumbnail}")
	private boolean saveThumbnailEnabled;
	
	@Value(value = "${pacs.address}")
	private String pacsIpBindAddress;

	@Autowired
	ApplicationEntityService applicationEntityService;
	
	@Autowired
	DirectoryWatchService directoryWatchService;

	@Autowired
	DicomServerCollectionBean dicomServerCollectionBean;

//	@Autowired
//	private StorageServiceImpl storageService;
	public static void main(String[] args) {
		SpringApplication.run(PacsApplication.class, args);
		LOG.info("================== Welcome to Almostkabal DICOM Server! ======================");
	}

	/**************************
	 * Handler for incoming files works with asynchronous event bus initiated by the
	 * DicomServer
	 ****************************/
	@Bean // only one incoming file handler. Even we have multiple DicomServer instances,
			// they all forward files to the same handler...
	public IncomingDicomFileHandler incomingFileHandler() {
		return new IncomingDicomFileHandler();
	}

	@Bean // Guava asynch event bus that initiates 100 fixed thread pool
	public EventBus asyncEventBus() {
		EventBus eventBus = new AsyncEventBus(java.util.concurrent.Executors.newFixedThreadPool(100));
		return eventBus;
	}

//	@Bean // dicom server takes storage output directory, ae title and ports. Server
//			// listens same number of ports with same ae title
//	public DicomServerCollectionBean dicomServers(@Value("${pacs.storage.dcm}") String storageDir,
//			@Value("${pacs.aetitle}") String aeTitle, @Value("#{'${pacs.ports}'.split(',')}") List<Integer> ports) {
//
//		DicomServerCollectionBean dicomServerCollectionBean = new DicomServerCollectionBean();
//		Map<String, DicomServer> dicomServers = new HashMap<>();
//			for (ApplicationEntity ae : applicationEntityService.getAllApplicationEntities()) {
//				Path storagePath = Paths.get(ae.getStoragePath());
//				if (!Files.exists(storagePath)) {
//					try {
//						Files.createDirectory(storagePath);
//					} catch (IOException e) {
//						LOG.error(e.getMessage(), e);
//						throw new RuntimeException("Could not initialize storage - "+ae.toString());
//					}
//				}
//				dicomServers.put("DICOM_SERVER_AT_" + ae.getPort(),
//						DicomServer.init(ae.getHostname(), ae.getPort(), ae.getTitle(), storagePath.toString(), asyncEventBus()));
//			}
//
//			dicomServerCollectionBean.setDicomServers(dicomServers);
//		
//		return dicomServerCollectionBean;
//	}

	/**************************
	 * End of Handler for incoming files works with asynchronous event bus initiated
	 * by the DicomServer
	 ****************************/

	@Bean
	@Qualifier(value = "activeDicoms")
	public ActiveDicoms activeDicoms() {
		return new ActiveDicoms();
	}

	@Override
	public void run(ApplicationArguments args) {
//		try {
//			Path rootPacsDicomLocation = Paths.get(pacsDicomStorage);
//			if (!Files.exists(rootPacsDicomLocation)) {
//				Files.createDirectory(rootPacsDicomLocation);
//			}
//
//			Path rootPacsImageStorageLocation = Paths.get(pacsImageStorage);
//			if (!Files.exists(rootPacsImageStorageLocation)) {
//				Files.createDirectory(rootPacsImageStorageLocation);
//			}
//
//		} catch (IOException e) {
//			LOG.error(e.getMessage(), e);
//			throw new RuntimeException("Could not initialize storage!");
//		}

		
		// start directoryWatchService
		try {
			DirectoryWatcherConfig watcherConfig = new DirectoryWatcherConfig(directoryWatcherEnabled, directoryWatcherPath, indexZipFilesEnabled, saveThumbnailEnabled);
			directoryWatchService.init(watcherConfig);
		} catch (IOException | InterruptedException e1) {
			e1.printStackTrace();
		}
		
		// start application Entities
		for (ApplicationEntity ae : applicationEntityService.getAllApplicationEntities()) {
			Path storagePath = Paths.get(ae.getStoragePath());
			if (!Files.exists(storagePath)) {
				try {
					Files.createDirectory(storagePath);
				} catch (IOException e) {
					LOG.error(e.getMessage(), e);
					throw new RuntimeException("Could not initialize storage - " + ae.toString());
				}
			}
			try {

				DicomServer server = DicomServer.init(ae.getHostname(), ae.getPort(), ae.getTitle(),
						storagePath.toString(), asyncEventBus());
				dicomServers.put("DICOM_SERVER_AT_" + ae.getPort(), server);

				if (!ae.isStatus()) {
					server.getDevice().unbindConnections();
				}
//				dicomServerCollectionBean.add("DICOM_SERVER_AT_" + ae.getPort(), DicomServer.init(ae.getHostname(),
//						ae.getPort(), ae.getTitle(), storagePath.toString(), asyncEventBus()));
			} catch (RuntimeException e) {
				LOG.error(e.getMessage(), e);
				throw new RuntimeException(e.getMessage());
			} catch (IOException e) {

				if (e.getCause() instanceof BindException)
					LOG.error(e.getMessage(), e);
			} catch (GeneralSecurityException e) {
				LOG.error(e.getMessage(), e);
				throw new RuntimeException(e.getMessage());
			}
		}

	}

	@PreDestroy
	public void onClose() {
		for (Map.Entry<String, DicomServer> entry : dicomServers.entrySet()) {
			entry.getValue().getDevice().unbindConnections();
			dicomServers.remove(entry.getKey());

		}
	}

//    /************************************************* Database JPA and Hibernate Settings ********************************************************/
//    @Bean //Creating and registering in spring context an entityManager
//    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
//        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
//        em.setDataSource(primaryDataSource());
//        em.setPersistenceUnitName("dbdicom");        
//        em.setPackagesToScan(new String[]{"org.easy.entity"}); // package where are the @Entity classes are located, usually your domain package
//        JpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter(); // JPA implementation 
//        em.setJpaVendorAdapter(vendorAdapter);    
//
//        return em;
//    }
////    
//    @Bean
//    @Primary //configure the primary database
//    @ConfigurationProperties
//    public DataSource primaryDataSource() {
//        return DataSourceBuilder.create().build();
//    }
//    
//    @Bean //Configuring the transactionManager
//    public PlatformTransactionManager transactionManager(EntityManagerFactory emf) {
//        JpaTransactionManager transactionManager = new JpaTransactionManager();        
//        transactionManager.setEntityManagerFactory(emf);
//        return transactionManager;
//    }
//
//    @Bean
//    public PersistenceExceptionTranslationPostProcessor exceptionTranslation() {
//        return new PersistenceExceptionTranslationPostProcessor();
//    }

	/*************************************************
	 * End of Database JPA and Hibernate Settings
	 ********************************************************/
}
