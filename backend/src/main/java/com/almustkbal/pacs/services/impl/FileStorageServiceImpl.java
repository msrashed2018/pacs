package com.almustkbal.pacs.services.impl;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.Timestamp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.almustkbal.pacs.exceptions.FileStorageException;
import com.almustkbal.pacs.exceptions.ResourceNotFoundException;
import com.almustkbal.pacs.services.FileStorageService;

@Service
public class FileStorageServiceImpl implements FileStorageService {

	Logger logger = LoggerFactory.getLogger(FileStorageServiceImpl.class);

	@Value("${files.storage.path}")
	private String mainStoragePath;

	@Override
	public InputStream downloadFile(String path) throws Exception {

		return null;
	}

	@Override
	public File storeFile(String path, MultipartFile file, String newfileName, boolean appendTime) throws Exception {
		// Normalize file name

		String fileName = "";
		if (appendTime) {
			Timestamp timestamp = new Timestamp(System.currentTimeMillis());

			fileName = newfileName + "_" + timestamp.getTime() + Thread.currentThread().getId();

		} else {
			fileName = newfileName;
		}

		try {
//		 Check if the file's name contains invalid characters
			if (fileName.contains("..")) {
				logger.error("Sorry! Filename contains invalid path sequence " + fileName);
				throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
			}

			Path fileStorageLocation = Paths.get(mainStoragePath + "/" + path).toAbsolutePath().normalize();

			try {
				Files.createDirectories(fileStorageLocation);
			} catch (Exception ex) {
				logger.error("Could not create the directory where the uploaded files will be stored : ",
						fileStorageLocation);
				throw new FileStorageException(
						"Could not create the directory where the uploaded files will be stored.");
			}

			// Copy file to the target location (Replacing existing file with the same name)
			Path targetLocation = fileStorageLocation.resolve(fileName);
			Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

			File targetFile = new File(targetLocation.toUri());
			return targetFile;
		} catch (IOException ex) {
			logger.error("error happened while storing file");
			throw new FileStorageException("Could not store file " + fileName + ". Please try again!");
		}

	}

	@Override
	public Resource loadFileAsResource(String filePath) {
		try {
			Path file = Paths.get(mainStoragePath + "/" + filePath).toAbsolutePath().normalize();

			Resource resource = new UrlResource(file.toUri());
			if (resource.exists()) {
				return resource;
			} else {
				throw new ResourceNotFoundException("File " + filePath + "not found");
			}
		} catch (MalformedURLException ex) {
			throw new ResourceNotFoundException("File not found", ex);
		}
	}

	@Override
	public byte[] loadFileAsBytes(String filePath) {
		Path file = Paths.get(mainStoragePath + "/" + filePath).toAbsolutePath().normalize();

		byte[] content = null;

		try {
			content = Files.readAllBytes(file);
		} catch (final IOException e) {
			logger.error("error happened while reading bytes of file " + filePath + "  :", e.getMessage());
		}

		return content;
	}

	@Override
	public boolean deleteFile(String filePath) {
//		Path file = Paths.get(mainStoragePath + "/" + filePath).toAbsolutePath().normalize();
		Path file = Paths.get(filePath).toAbsolutePath().normalize();
		boolean isDeleted = false;
		try {
			Files.delete(file);
			isDeleted = true;
		} catch (IOException e) {
			logger.error("error happened while deleting file " + filePath + "  :", e.getMessage());
		}
		return isDeleted;
	}

	@Override
	public File createFile(String path, String newfileName, boolean appendTime) throws Exception {
		// Normalize file name

		logger.info("\n\n\n\n saving \n\n\n\n");
		String fileName = "";
		if (appendTime) {
			Timestamp timestamp = new Timestamp(System.currentTimeMillis());
			Thread.sleep(1);
			fileName = newfileName + "_" + timestamp.getTime();
		} else {
			fileName = newfileName;
		}

		try {
//				 Check if the file's name contains invalid characters
			if (fileName.contains("..")) {
				logger.error("Sorry! Filename contains invalid path sequence " + fileName);
				throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
			}

			Path fileStorageLocation = Paths.get(mainStoragePath + "/" + path).toAbsolutePath().normalize();

			try {
				Files.createDirectories(fileStorageLocation);
			} catch (Exception ex) {
				logger.error("Could not create the directory where the uploaded files will be stored : ",
						fileStorageLocation);
				throw new FileStorageException(
						"Could not create the directory where the uploaded files will be stored.");
			}

			// Copy file to the target location (Replacing existing file with the same name)
			Path targetLocation = fileStorageLocation.resolve(fileName);
			File targetFile = new File(targetLocation.toUri());

			logger.info("\n\n\n\n saved \n\n\n\n");
			return targetFile;
		} catch (Exception ex) {
			logger.error("error happened while storing file");
			throw new FileStorageException("Could not store file " + fileName + ". Please try again!");
		}
	}

}
