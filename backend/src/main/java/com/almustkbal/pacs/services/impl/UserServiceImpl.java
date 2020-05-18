/**
 * 
 */
package com.almustkbal.pacs.services.impl;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AccountStatusUserDetailsChecker;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.almustkbal.pacs.dicom.dto.UserFilterDTO;
import com.almustkbal.pacs.domain.PasswordResetToken;
import com.almustkbal.pacs.domain.Privilege;
import com.almustkbal.pacs.domain.Role;
import com.almustkbal.pacs.domain.UpdateUserRequest;
import com.almustkbal.pacs.domain.User;
import com.almustkbal.pacs.exceptions.BusinessException;
import com.almustkbal.pacs.exceptions.ResourceAlreadyExistException;
import com.almustkbal.pacs.exceptions.ResourceNotFoundException;
import com.almustkbal.pacs.model.Mail;
import com.almustkbal.pacs.repositories.PasswordResetTokenRepository;
import com.almustkbal.pacs.repositories.PrivilegeRepository;
import com.almustkbal.pacs.repositories.RoleRepository;
import com.almustkbal.pacs.repositories.UserRepository;
import com.almustkbal.pacs.services.EmailService;
import com.almustkbal.pacs.services.UserService;

import freemarker.template.TemplateException;

/**
 * @author mohamedsalah
 *
 */
@Service
public class UserServiceImpl implements UserService {

	private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PrivilegeRepository privilegeRepository;

	@Autowired
	private EmailService emailService;

	@Autowired
	private PasswordResetTokenRepository confirmationTokenRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private MessageSource messages;

	@Override
	public Page<User> getUsers(UserFilterDTO userFilterDTO, Pageable pageable) {

		return userRepository.findUsers(userFilterDTO.getRole(), userFilterDTO.getSearchKey(),
				userFilterDTO.getUsername(), userFilterDTO.getEmail(), userFilterDTO.getMobile(),
				userFilterDTO.getEnabled(), userFilterDTO.getName(), userFilterDTO.getRegisteredDate(), pageable);
	}

	@Override
	public User getUserById(Long id) {
		Optional<User> user = userRepository.findById(id);
		if (!user.isPresent()) {
			throw new ResourceNotFoundException(
					messages.getMessage("error.resourceNotFound.user", null, LocaleContextHolder.getLocale()));
		}
		return user.get();
	}

	@Override
	public User createUser(User user) {
		List<User> existingUsers = userRepository.findByUsernameOrEmailIgnoreCaseOrMobile(user.getUsername(),
				user.getEmail(), user.getMobile());
		if (existingUsers.size() > 0) {
			if (existingUsers.get(0).getUsername().equals(user.getUsername())) {
				throw new ResourceAlreadyExistException(messages.getMessage("error.resourceAlreadyExists.user.username",
						null, LocaleContextHolder.getLocale()));
			} else if (existingUsers.get(0).getEmail().equalsIgnoreCase(user.getEmail())) {
				throw new ResourceAlreadyExistException(messages.getMessage("error.resourceAlreadyExists.user.email",
						null, LocaleContextHolder.getLocale()));
			} else if (existingUsers.get(0).getMobile().equals(user.getMobile())) {
				throw new ResourceAlreadyExistException(messages.getMessage("error.resourceAlreadyExists.user.mobile",
						null, LocaleContextHolder.getLocale()));
			}
		}

		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepository.save(user);
	}

	@Override
	public User updateUser(Long id, UpdateUserRequest user) {
		Optional<User> existingUser = userRepository.findById(id);
		if (!existingUser.isPresent()) {
			throw new ResourceNotFoundException(
					messages.getMessage("error.resourceNotFound.user", null, LocaleContextHolder.getLocale()));
		}

		if (!existingUser.get().getUsername().equals(user.getUsername())) {
			if (userRepository.existsByUsername(user.getUsername())) {
				throw new ResourceAlreadyExistException(messages.getMessage("error.resourceAlreadyExists.user.username",
						null, LocaleContextHolder.getLocale()));
			}
		}

		if (!existingUser.get().getMobile().equals(user.getMobile())) {
			if (userRepository.existsByMobile(user.getMobile())) {
				throw new ResourceAlreadyExistException(messages.getMessage("error.resourceAlreadyExists.user.mobile",
						null, LocaleContextHolder.getLocale()));
			}
		}

		if (!existingUser.get().getEmail().equals(user.getEmail())) {
			if (userRepository.existsByEmail(user.getEmail())) {
				throw new ResourceAlreadyExistException(messages.getMessage("error.resourceAlreadyExists.user.email",
						null, LocaleContextHolder.getLocale()));
			}
		}

		existingUser.get().setUsername(user.getUsername());
//		existingUser.get().setAge(user.getAge());
		existingUser.get().setFirstname(user.getFirstname());
		existingUser.get().setEmail(user.getEmail());
		existingUser.get().setLastname(user.getLastname());
		existingUser.get().setGender(user.getGender());
		existingUser.get().setMobile(user.getMobile());

		List<Role> roles = roleRepository.findAll();
		roles.retainAll(user.getRoles());
		existingUser.get().setRoles(roles);

		Set<Privilege> privileges = null;
		if (user.getPrivileges() != null) {
			List<Privilege> privilegesList = privilegeRepository.findAll();
			privilegesList.retainAll(user.getPrivileges());
			privileges = new HashSet<Privilege>(privilegesList);
		}
		existingUser.get().setPrivileges(privileges);

		return userRepository.save(existingUser.get());

	}

	@Override
	public User updateProfile(Long id, User user) {
		Optional<User> existingUser = userRepository.findById(id);
		if (!existingUser.isPresent()) {
			throw new ResourceNotFoundException(
					messages.getMessage("error.resourceNotFound.user", null, LocaleContextHolder.getLocale()));
		}

		if (!existingUser.get().getUsername().equals(user.getUsername())) {
			if (userRepository.existsByUsername(user.getUsername())) {
				throw new ResourceAlreadyExistException(messages.getMessage("error.resourceAlreadyExists.user.username",
						null, LocaleContextHolder.getLocale()));
			}
		}

		if (!existingUser.get().getMobile().equals(user.getMobile())) {
			if (userRepository.existsByMobile(user.getMobile())) {
				throw new ResourceAlreadyExistException(messages.getMessage("error.resourceAlreadyExists.user.mobile",
						null, LocaleContextHolder.getLocale()));
			}
		}

		if (!existingUser.get().getEmail().equals(user.getEmail())) {
			if (userRepository.existsByEmail(user.getEmail())) {
				throw new ResourceAlreadyExistException(messages.getMessage("error.resourceAlreadyExists.user.email",
						null, LocaleContextHolder.getLocale()));
			}
		}

		existingUser.get().setUsername(user.getUsername());
		existingUser.get().setAge(user.getAge());
		existingUser.get().setFirstname(user.getFirstname());
		existingUser.get().setEmail(user.getEmail());
		existingUser.get().setLastname(user.getLastname());
		existingUser.get().setGender(user.getGender());
		existingUser.get().setMobile(user.getMobile());

		return userRepository.save(existingUser.get());
	}

	@Override
	public void disableUser(Long id) {

		User user = this.getUserById(id);
		user.setEnabled(false);
		userRepository.save(user);
	}

	@Override
	public void enableUser(Long id) {
		User user = this.getUserById(id);
		user.setEnabled(true);
		userRepository.save(user);
	}

	// below method is used by oauth2 to authenticate user Login
	@Override
	public User loadUserByUsername(String username) throws UsernameNotFoundException {

		Optional<User> user = userRepository.findByUsername(username);
		if (!user.isPresent()) {
			throw new BadCredentialsException(
					messages.getMessage("message.badCredentials", null, LocaleContextHolder.getLocale()));

		}

		new AccountStatusUserDetailsChecker().check(user.get());
		return user.get();
	}

	@Override
	public boolean changePassword(String oldPassword, String newpassword) {

		User user = getUserById(getCurrentAuthenticatedUser().getId());

		boolean match = passwordEncoder.matches(oldPassword, user.getPassword());

		if (match == true) {
			user.setPassword(passwordEncoder.encode(newpassword));

			userRepository.save(user);

			return true;
		} else {
			throw new BusinessException(
					messages.getMessage("error.invalidOldPassword", null, LocaleContextHolder.getLocale()));
		}
	}

	@Override
	public User getCurrentAuthenticatedUser() {
		User currentAuthenticatedUser = null;
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Object principal = authentication.getPrincipal();

		if (principal instanceof User) {
			currentAuthenticatedUser = ((User) principal);
		}

		return currentAuthenticatedUser;
	}

	@Override
	public String getCurrentAuthenticatedUsername() {
		return getCurrentAuthenticatedUser().getUsername();
	}

	@Override
	@Transactional
	public boolean forgetPassword(String username) {
		Optional<User> existingUser = userRepository.findByUsername(username);

		if (!existingUser.isPresent()) {
			throw new ResourceNotFoundException(messages.getMessage("error.forgotpassword.usernameNotFound", null,
					LocaleContextHolder.getLocale()));
		}

		if (confirmationTokenRepository.existsByUser(existingUser.get())) {
			return true;
		}

		// create token
		PasswordResetToken confirmationToken = new PasswordResetToken(existingUser.get());

		// save it
		confirmationTokenRepository.save(confirmationToken);

		// send it by mail to user email
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
				.getRequest();

		String subject = messages.getMessage("message.resetpassword.email.subject", null,
				LocaleContextHolder.getLocale());

		Mail mail = new Mail();
		mail.setTo(existingUser.get().getEmail());
		mail.setSubject(subject);
		mail.setTemplate("/emails/reset-password.ftl");
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("resetpasswordLink", getAppUrl(request) + "/ext/confirm-reset?token=" + confirmationToken.getToken());
		mail.setModel(model);
		try {

			emailService.sendEmail(mail);
		} catch (MessagingException | IOException | TemplateException e) {
			logger.error("error happened while sending email:", e.getMessage());
			throw new RuntimeException(e.getMessage());
		}

		return true;
	}

	// NON API
	private String getAppUrl(HttpServletRequest request) {
		return "https://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
	}

	@Override
	@Transactional
	public void updateLastLogin(User user) {
		user.setLastlogin(new Date());
		userRepository.save(user);
	}

}
