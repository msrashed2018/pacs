package com.almustkbal.pacs.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class Encryption {
	@Value("${app.encryption.enabled}")
	private boolean isEncryptionEnabled;

	@Value("${app.encryption.salt}")
	private String saltValue;

	@Value("${app.encryption.iv}")
	private String ivValue;

	@Value("${app.encryption.passphrase}")
	private String passphraseValue;

	public static boolean enabled;
	public static String salt;
	public static String iv;
	public static String passphrase;

	@EventListener
	public void handleContextRefresh(ContextRefreshedEvent event) {
		enabled = isEncryptionEnabled;
		salt = saltValue;
		iv = ivValue;
		passphrase = passphraseValue;
	}

	public Encryption() {
	}
}
