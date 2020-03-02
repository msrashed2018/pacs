package com.almustkbal.pacs.controllers;

import java.io.IOException;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.almustkbal.pacs.config.DirectoryWatcherConfig;
import com.almustkbal.pacs.services.DirectoryWatchService;

@CrossOrigin(origins = "*")
@RestController
public class DirectoryWatcherController {
	@Autowired
	private DirectoryWatchService directoryWatchService;

	@PutMapping("/directory-watcher")
	public void manageDirectoryWatcher(@Valid @RequestBody DirectoryWatcherConfig watcherConfig) {
		try {
			if (watcherConfig.isEnabled()) {
				directoryWatchService.init(watcherConfig);
			}else {
				directoryWatchService.disable();
			}
		} catch (IOException | InterruptedException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}

	
	@RequestMapping(value = "/directory-watcher", method = RequestMethod.GET)
	public  DirectoryWatcherConfig getCurrentWatherConfig() {
		return directoryWatchService.getCurrentWatcherConfig();
	}
	
}
