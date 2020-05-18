/*
 *-----------------------------------------------------------------------------
 * name             : FileManagerService.java
 * project          : e-statement
 * created          : pfolque - THALES - 03/04/2009
 * language         : java
 * environment      : jdk1.5
 * copyright        : (c) 2007 Thales. All Rights Reserved.
 *-----------------------------------------------------------------------------
 */

package com.almustkbal.pacs.services;

import java.io.File;
import java.io.InputStream;

import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface FileStorageService {

	InputStream downloadFile(String filePath) throws Exception;

	File storeFile(String path, MultipartFile file, String newfileName, boolean appendTime) throws Exception;

	File createFile(String path, String newfileName, boolean appendTime) throws Exception;

	Resource loadFileAsResource(String filePath);

	boolean deleteFile(String filePath);

	byte[] loadFileAsBytes(String filePath);

}
