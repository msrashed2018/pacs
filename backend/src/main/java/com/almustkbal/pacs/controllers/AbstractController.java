/**
 * 
 */
package com.almustkbal.pacs.controllers;

import java.io.IOException;
import java.util.Date;

import org.dcm4che3.io.DicomStreamException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.almustkbal.pacs.exceptions.ExceptionResponse;


/**
 * @author dartiga
 *
 */
public abstract class AbstractController  {
	private static final Logger logger = LoggerFactory.getLogger(AbstractController.class);
	@Order(value = 0)
	@ExceptionHandler(IOException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public @ResponseBody ExceptionResponse handleIOException(IOException e) {
		
		logger.error("[{}] {}", e.getMessage() , e);
			return new ExceptionResponse(new Date() , e.getMessage(), e.getCause().toString());
	}
	
	@Order(value = 0)
	@ExceptionHandler(Exception.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public @ResponseBody ExceptionResponse handleGenericSystemException(Exception e) {

		logger.error("[{}] {}", e.getMessage() , e);
		return new ExceptionResponse(new Date() , e.getMessage(), e.getCause().toString());
	}
	
	@Order(value = 0)
	@ExceptionHandler(RuntimeException.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public @ResponseBody ExceptionResponse handleRuntimeException(Exception e) {

		logger.error("[{}] {}", e.getMessage() , e);
		return new ExceptionResponse(new Date() , e.getMessage(), e.getCause().toString());
	}
//	@Order(value = 0)
	@ExceptionHandler(DicomStreamException.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public @ResponseBody ExceptionResponse handleDicomStreamException(Exception e) {
System.out.println("hereeeeeeeeeeeeee");
		logger.error("[{}] {}", e.getMessage() , e);
		return new ExceptionResponse(new Date() , e.getMessage(), e.getCause().toString());
	}
	
}
