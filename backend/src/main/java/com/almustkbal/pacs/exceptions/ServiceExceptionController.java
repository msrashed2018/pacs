package com.almustkbal.pacs.exceptions;

import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.util.CollectionUtils;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class ServiceExceptionController extends ResponseEntityExceptionHandler {

	Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private MessageSource messageSource;

	@ExceptionHandler(ResourceNotFoundException.class)
	public final ResponseEntity<Object> handleAllExceptions(Exception ex, WebRequest request) {
		ExceptionResponse exceptionResponse = new ExceptionResponse(new Date(), ex.getMessage(),
				request.getDescription(false));
		return new ResponseEntity(exceptionResponse, HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public final ResponseEntity<Object> handleMethodArgumentTypeMismatchException(Exception ex, WebRequest request) {
		ExceptionResponse exceptionResponse = new ExceptionResponse(new Date(), ex.getMessage(),
				request.getDescription(false));
		return new ResponseEntity(exceptionResponse, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(MaxUploadSizeExceededException.class)
	@ResponseBody
	@ResponseStatus(HttpStatus.EXPECTATION_FAILED)
	String handleFileException(HttpServletRequest request, Throwable ex) {
		// return your json insted this string.
		return "Maximum upload size exceeded";
	}

	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		String message = "";
		List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();
		for (FieldError fieldError: fieldErrors) {
			message = message + "  " + fieldError.getDefaultMessage();
        }
		
		ExceptionResponse exceptionResponse = new ExceptionResponse(new Date(), message,
				ex.getBindingResult().toString());
		return new ResponseEntity(exceptionResponse, HttpStatus.BAD_REQUEST);
	}

	@Override
	protected ResponseEntity<Object> handleHttpMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {

		List<MediaType> mediaTypes = ex.getSupportedMediaTypes();
		if (!CollectionUtils.isEmpty(mediaTypes)) {
			headers.setAccept(mediaTypes);
		}
		ExceptionResponse exceptionResponse = new ExceptionResponse(new Date(), "file type is not supported",
				ex.getMessage());
		return new ResponseEntity(exceptionResponse, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler({ TransactionSystemException.class })
	public ResponseEntity<Object> handleConstraintViolation(Exception ex, WebRequest request) {
		Throwable cause = ((TransactionSystemException) ex).getRootCause();
		if (cause instanceof ConstraintViolationException) {
			Set<ConstraintViolation<?>> constraintViolations = ((ConstraintViolationException) cause)
					.getConstraintViolations();
			String message = "";
			for (ConstraintViolation constraintViolation : constraintViolations) {
				message = message + constraintViolation.getMessage() + ", ";
			}
			ExceptionResponse exceptionResponse = new ExceptionResponse(new Date(),
					((ConstraintViolationException) ex.getCause()).getMessage(), message);
			return new ResponseEntity(exceptionResponse, HttpStatus.BAD_REQUEST);

		}
		return new ResponseEntity(new ExceptionResponse(new Date(), ex.getMessage(), request.getDescription(false)),
				HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	@ResponseBody
	public ResponseEntity<Object> conflict(HttpServletRequest req, DataIntegrityViolationException e,
			WebRequest request) {
		System.out.println("\n\n DataIntegrityViolationException Message = "+e.getMostSpecificCause().getMessage()+"\n\n");
		String message = "";
		if(e.getMostSpecificCause().getMessage().contains("child record found")){
			message = " عفوا لا يمكن الحذف ";
		}else if(e.getMostSpecificCause().getMessage().contains("primary key violation")){
			message = "هذا النوع تم تسجلة من قبل";
		}else{
			message = e.getMostSpecificCause().getMessage();
		}
		ExceptionResponse exceptionResponse = new ExceptionResponse(new Date(), message,
				e.getCause().getMessage());
		return new ResponseEntity(exceptionResponse, HttpStatus.CONFLICT);// 409
	}

}
