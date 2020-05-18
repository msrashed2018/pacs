package com.almustkbal.pacs.model;

import java.io.File;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Mail {
	private String from;
	private String to;
	private String subject;
	private String template;
	private Map<String, Object> model;
	private Map<String, File> attachments;

}
