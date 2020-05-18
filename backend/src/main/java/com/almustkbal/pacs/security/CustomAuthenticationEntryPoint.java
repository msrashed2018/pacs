package com.almustkbal.pacs.security;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

	private static final Logger logger = LoggerFactory.getLogger(CustomAuthenticationEntryPoint.class);
	private final HttpMessageConverter<String> messageConverter;

	private final ObjectMapper mapper;

	public CustomAuthenticationEntryPoint(ObjectMapper mapper) {
		this.messageConverter = new StringHttpMessageConverter();
		this.mapper = mapper;
	}

	@Override
	public void commence(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,
			AuthenticationException e) throws IOException {
		logger.info("\n\n\n Pre-authenticated entry point called. Rejecting access\n\n\n");
		httpServletResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Access Denied");
	}
}
