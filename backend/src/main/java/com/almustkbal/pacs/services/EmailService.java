package com.almustkbal.pacs.services;

import java.io.IOException;

import javax.mail.MessagingException;

import com.almustkbal.pacs.model.Mail;

import freemarker.template.TemplateException;

public interface EmailService {
	boolean sendEmail(Mail mail) throws MessagingException, IOException, TemplateException;

}
