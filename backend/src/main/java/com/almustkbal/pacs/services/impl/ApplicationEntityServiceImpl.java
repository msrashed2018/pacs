/**
 * 
 */
package com.almustkbal.pacs.services.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.almustkbal.pacs.PacsApplication;
import com.almustkbal.pacs.entities.ApplicationEntity;
import com.almustkbal.pacs.exceptions.ResourceNotFoundException;
import com.almustkbal.pacs.repositories.ApplicationEntityRepository;
import com.almustkbal.pacs.server.DicomServer;
import com.almustkbal.pacs.server.DicomServerCollectionBean;
import com.almustkbal.pacs.services.ApplicationEntityService;
import com.google.common.eventbus.EventBus;

/**
 * @author mohamedsalah
 *
 */
@Service
public class ApplicationEntityServiceImpl implements ApplicationEntityService {

	private static final Logger LOG = LoggerFactory.getLogger(PacsApplication.class);

	@Autowired
	private ApplicationEntityRepository applicationEntityRepository;

	@Autowired(required = true)
	DicomServerCollectionBean dicomServerCollectionBean;

	@Autowired(required = true)
	EventBus eventBus;

	@Override
	public List<ApplicationEntity> getAllApplicationEntities() {
		List<ApplicationEntity> entities = applicationEntityRepository.findAll();

		for (ApplicationEntity entity : entities) {
			for (Map.Entry<String, DicomServer> entry : PacsApplication.dicomServers.entrySet()) {
				DicomServer server = entry.getValue();
				if (server.getConn().getPort() == entity.getPort()
						&& server.getConn().getHostname() == entity.getHostname()
						&& server.getAe().getAETitle().equals(entity.getTitle())) {
					if (server.getConn().isListening()) {
						entity.setStatus(true);
					}
				}
			}
		}
		return entities;
	}

	@Override
	public Page<ApplicationEntity> getApplicationEntities(Pageable pageable) {
		Page<ApplicationEntity> entities = applicationEntityRepository.findAll(pageable);
		for (ApplicationEntity entity : entities) {
			for (Map.Entry<String, DicomServer> entry : PacsApplication.dicomServers.entrySet()) {
				DicomServer server = entry.getValue();
				if (server.getConn().getPort() == entity.getPort()
						&& server.getConn().getHostname() == entity.getHostname()
						&& server.getAe().getAETitle().equals(entity.getTitle())) {
					if (server.getConn().isListening()) {
						entity.setStatus(true);
					}
				}
			}
		}

		return entities;
	}

	@Override
	public ApplicationEntity getApplicationEntityById(long id) {
		Optional<ApplicationEntity> applicationEntity = applicationEntityRepository.findById(id);
		if (!applicationEntity.isPresent()) {
			throw new ResourceNotFoundException("ApplicationEntityId " + id + " not found");
		}
		return applicationEntity.get();
	}

	@Override
	@Transactional
	public ApplicationEntity createApplicationEntity(ApplicationEntity ae) {

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

			PacsApplication.dicomServers.put("DICOM_SERVER_AT_" + ae.getPort(),
					DicomServer.init(ae.getHostname(), ae.getPort(), ae.getTitle(), storagePath.toString(), eventBus));
			ae.setStatus(true);
		} catch (IOException | GeneralSecurityException e) {
			LOG.error(e.getMessage(), e);
			throw new RuntimeException(e.getMessage());
		}
		return applicationEntityRepository.save(ae);
	}

	@Override
	public ApplicationEntity updateApplicationEntity(long id, ApplicationEntity applicationEntity) {
		Optional<ApplicationEntity> existingApplicationEntity = applicationEntityRepository.findById(id);
		if (!existingApplicationEntity.isPresent()) {
			throw new ResourceNotFoundException("ApplicationEntityId " + id + " not found");
		}
		existingApplicationEntity.get().setHostname(applicationEntity.getHostname());
		existingApplicationEntity.get().setTitle(applicationEntity.getTitle());
		existingApplicationEntity.get().setPort(applicationEntity.getPort());
		existingApplicationEntity.get().setDescription(applicationEntity.getDescription());

		for (Map.Entry<String, DicomServer> entry : PacsApplication.dicomServers.entrySet()) {
			DicomServer server = entry.getValue();
			if (server.getConn().getPort() == existingApplicationEntity.get().getPort()
					&& server.getConn().getHostname() == existingApplicationEntity.get().getHostname()
					&& server.getAe().getAETitle().equals(existingApplicationEntity.get().getTitle())) {
				server.getDevice().unbindConnections();
				PacsApplication.dicomServers.remove(entry.getKey());
			}
		}

		Path storagePath = Paths.get(applicationEntity.getStoragePath());
		if (!Files.exists(storagePath)) {
			try {
				Files.createDirectory(storagePath);
			} catch (IOException e) {
				LOG.error(e.getMessage(), e);
				throw new RuntimeException("Could not initialize storage - " + applicationEntity.toString());
			}
		}
		try {
			System.out.println("adding new server");
			PacsApplication.dicomServers.put("DICOM_SERVER_AT_" + applicationEntity.getPort(),
					DicomServer.init(applicationEntity.getHostname(), applicationEntity.getPort(),
							applicationEntity.getTitle(), storagePath.toString(), eventBus));
		} catch (IOException | GeneralSecurityException e) {
			LOG.error(e.getMessage(), e);
			throw new RuntimeException(e.getMessage());
		}

		return applicationEntityRepository.save(existingApplicationEntity.get());
	}

	@Override
	@Transactional
	public void deleteApplicationEntity(long id) {
		Optional<ApplicationEntity> applicationEntity = applicationEntityRepository.findById(id);
		if (!applicationEntity.isPresent()) {
			throw new ResourceNotFoundException("ApplicationEntityId " + id + " not found");
		}
		for (Map.Entry<String, DicomServer> entry : PacsApplication.dicomServers.entrySet()) {
			DicomServer server = entry.getValue();
			if (server.getConn().getPort() == applicationEntity.get().getPort()
					&& server.getConn().getHostname() == applicationEntity.get().getHostname()
					&& server.getAe().getAETitle().equals(applicationEntity.get().getTitle())) {
				server.getDevice().unbindConnections();
				PacsApplication.dicomServers.remove(entry.getKey());
			}
		}

		applicationEntityRepository.deleteById(id);
	}

	@Override
	public void startApplicationEntity(long id) {
		Optional<ApplicationEntity> applicationEntity = applicationEntityRepository.findById(id);
		if (!applicationEntity.isPresent()) {
			throw new ResourceNotFoundException("ApplicationEntityId " + id + " not found");
		}
		for (Map.Entry<String, DicomServer> entry : PacsApplication.dicomServers.entrySet()) {
			DicomServer server = entry.getValue();
			if (server.getConn().getPort() == applicationEntity.get().getPort()
					&& server.getConn().getHostname() == applicationEntity.get().getHostname()
					&& server.getAe().getAETitle().equals(applicationEntity.get().getTitle())) {
				try {
					server.getDevice().bindConnections();
					applicationEntity.get().setStatus(true);
					applicationEntityRepository.save(applicationEntity.get());

				} catch (IOException | GeneralSecurityException e) {
					LOG.error(e.getMessage(), e);
					throw new RuntimeException(e.getMessage());
				}
			}
		}

	}

	@Override
	public void stopApplicationEntity(long id) {
		Optional<ApplicationEntity> applicationEntity = applicationEntityRepository.findById(id);
		if (!applicationEntity.isPresent()) {
			throw new ResourceNotFoundException("ApplicationEntityId " + id + " not found");
		}
		for (Map.Entry<String, DicomServer> entry : PacsApplication.dicomServers.entrySet()) {
			DicomServer server = entry.getValue();
			if (server.getConn().getPort() == applicationEntity.get().getPort()
					&& server.getConn().getHostname() == applicationEntity.get().getHostname()
					&& server.getAe().getAETitle().equals(applicationEntity.get().getTitle())) {
				server.getDevice().unbindConnections();
				applicationEntity.get().setStatus(false);
				applicationEntityRepository.save(applicationEntity.get());
			}
		}
	}

}
