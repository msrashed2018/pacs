package com.almustkbal.pacs.services.impl;

import java.io.File;
import java.io.IOException;
import java.nio.file.ClosedWatchServiceException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardWatchEventKinds;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.almustkbal.pacs.config.DirectoryWatcherConfig;
import com.almustkbal.pacs.events.NewDicomEvent;
import com.almustkbal.pacs.services.DirectoryWatchService;
import com.google.common.eventbus.EventBus;

import lombok.Getter;
import lombok.Setter;

@Service
@Setter
@Getter
public class DirectoryWatchServiceImpl implements DirectoryWatchService, Runnable {

	private WatchService watchService;
	private WatchKey watchkey;
	public DirectoryWatcherConfig watcherConfig = new DirectoryWatcherConfig();

	@Autowired(required = true)
	private EventBus eventBus;

	private static final Logger LOG = LoggerFactory.getLogger(DirectoryWatchServiceImpl.class);

	@Override
	public void init(DirectoryWatcherConfig config) throws IOException, InterruptedException {
		if (watchkey != null) {
			if (!watchkey.isValid()) {
				this.watcherConfig = config;
				startNewWatcherService();

			} else {
				if (!config.getDirectoryPath().equals(watcherConfig.getDirectoryPath())) {
					
					if(Files.exists(Paths.get(config.getDirectoryPath()))) {
						stopCurrentWatcherService();
						this.watcherConfig = config;
						startNewWatcherService();
					}else {
						throw new RuntimeException("Directory Path is not existing");
					}
					
				} else {
					this.watcherConfig = config;
					LOG.warn(" Directory Watching is Already started on Path => " + watcherConfig.getDirectoryPath() + " ....");
				}
			}
		} else {
			this.watcherConfig = config;
			startNewWatcherService();
		}

	}

	@Override
	public void disable() throws IOException {
		if (watchService != null) {
			this.watcherConfig.setEnabled(false);
			stopCurrentWatcherService();
		}
	}

	private void startNewWatcherService() {
		LOG.info(" Starting Directory Watching Service on Path => " + watcherConfig.getDirectoryPath() + " ....");
		Thread wathingThread = new Thread(this);
		wathingThread.start();
	}

	private void stopCurrentWatcherService() throws IOException {
		LOG.warn("Disabling Directory Watching Service on Path => " + watcherConfig.getDirectoryPath() + " ....");
		watchService.close();
	}

	@Override
	public void run() {
//		path.register(watchService, StandardWatchEventKinds.ENTRY_CREATE, StandardWatchEventKinds.ENTRY_DELETE,
//				StandardWatchEventKinds.ENTRY_MODIFY);
		try {
			watchService = FileSystems.getDefault().newWatchService();
			Path path = Paths.get(watcherConfig.getDirectoryPath());
			watchkey = path.register(watchService, StandardWatchEventKinds.ENTRY_CREATE);
			WatchKey key;
			while ((key = watchService.take()) != null) {
				for (WatchEvent<?> event : key.pollEvents()) {
					LOG.info("Event kind:" + event.kind() + ". File : " + event.context() + ".");
//					Path dir = (Path) key.watchable();
//					Path fullPath = dir.resolve((Path) event.context());
//					
//					File convFile = fullPath.toFile();
					String dicomFilePath = path.toString() + "\\" + event.context();
					File convFile = new File(dicomFilePath);
					if (!convFile.isDirectory()) {
						NewDicomEvent dicomEvent = new NewDicomEvent(convFile);
						eventBus.post(dicomEvent);
					} else {

						// TODO to handle directory files recursively.
					}
				}
				key.reset();
			}
		} catch (InterruptedException e) {
			LOG.error(e.getMessage(), e);
		} catch (IOException e) {
			LOG.error(e.getMessage(), e);
		} catch (ClosedWatchServiceException e) {
			LOG.warn(" Watching Service has been closed ");
		}

	}

	@Override
	public DirectoryWatcherConfig getCurrentWatcherConfig() {
		return this.watcherConfig;
	}

}
