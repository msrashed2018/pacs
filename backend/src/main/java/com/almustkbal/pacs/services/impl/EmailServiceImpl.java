package com.almustkbal.pacs.services.impl;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

import com.almustkbal.pacs.model.Mail;
import com.almustkbal.pacs.services.EmailService;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;

@Service
public class EmailServiceImpl implements EmailService {

	@Autowired
	private JavaMailSender emailSender;

	@Override
	public boolean sendEmail(Mail mail) throws MessagingException, IOException, TemplateException {
		MimeMessage message = emailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
				StandardCharsets.UTF_8.name());

		Configuration freemarkerConfig = new Configuration(Configuration.VERSION_2_3_28);
		freemarkerConfig.setClassForTemplateLoading(this.getClass(), "/");
		Template t = freemarkerConfig.getTemplate(mail.getTemplate());
		String html = FreeMarkerTemplateUtils.processTemplateIntoString(t, mail.getModel());

		helper.setTo(mail.getTo());
		if (mail.getFrom() != null) {
			helper.setFrom(mail.getFrom());
		} else {
			helper.setFrom("msrashed100@gmail.com");
		}

		helper.setText(html, true);
		helper.addAttachment("logo.png", new ClassPathResource("images/khedma-logo.png"));
		if (mail.getAttachments() != null) {
			for (Map.Entry<String, File> entry : mail.getAttachments().entrySet()) {
				helper.addAttachment(entry.getKey(), entry.getValue());
			}
		}
		helper.setSubject(mail.getSubject());
		emailSender.send(message);

		return true;
	}
}
