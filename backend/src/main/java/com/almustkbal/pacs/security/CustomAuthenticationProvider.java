package com.almustkbal.pacs.security;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.almustkbal.pacs.domain.User;
import com.almustkbal.pacs.services.UserService;

import lombok.extern.slf4j.Slf4j;

//@Component
@Slf4j
public class CustomAuthenticationProvider extends DaoAuthenticationProvider {

	@Autowired
	private PasswordEncoder encoder;

	@Autowired
	private UserService userService;

	@Autowired
	private MessageSource messages;

	@Autowired
	private HttpServletRequest request;

	@Override
	public Authentication authenticate(Authentication auth) throws AuthenticationException {

		String username = auth.getName();
		String password = auth.getCredentials().toString();
		if (Encryption.enabled) {
			// Decrypt Username and Password
			AesUtils aesUtils = new AesUtils();
			if (username != null)
				username = aesUtils.decrypt(Encryption.salt, Encryption.iv, Encryption.passphrase, username);
			if (password != null)
				password = aesUtils.decrypt(Encryption.salt, Encryption.iv, Encryption.passphrase, password);
		}

		User user = (User) userService.loadUserByUsername(username);
		if (!encoder.matches(password, user.getPassword())) {
			log.info("\n\n not matched \n\n");

			throw new BadCredentialsException(
					messages.getMessage("message.badCredentials", null, LocaleContextHolder.getLocale()));
		}
		userService.updateLastLogin(user);
		return new UsernamePasswordAuthenticationToken(user, password, user.getAuthorities());
	}

	@Override
	public boolean supports(Class<?> authentication) {
		return authentication.equals(UsernamePasswordAuthenticationToken.class);
	}
}
