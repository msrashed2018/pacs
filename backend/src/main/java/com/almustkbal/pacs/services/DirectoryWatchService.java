package com.almustkbal.pacs.services;

import java.io.IOException;

import com.almustkbal.pacs.config.DirectoryWatcherConfig;



public interface DirectoryWatchService {
	
	void init(DirectoryWatcherConfig watcherConfig) throws IOException ,InterruptedException;
	void disable()  throws IOException;
	DirectoryWatcherConfig getCurrentWatcherConfig();
}
