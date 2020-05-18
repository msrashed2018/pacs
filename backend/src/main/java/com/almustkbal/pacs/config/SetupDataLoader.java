package com.almustkbal.pacs.config;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.almustkbal.pacs.domain.Privilege;
import com.almustkbal.pacs.domain.PrivilegeName;
import com.almustkbal.pacs.domain.Role;
import com.almustkbal.pacs.domain.RoleName;
import com.almustkbal.pacs.domain.User;
import com.almustkbal.pacs.repositories.PrivilegeRepository;
import com.almustkbal.pacs.repositories.RoleRepository;
import com.almustkbal.pacs.repositories.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class SetupDataLoader implements ApplicationListener<ContextRefreshedEvent> {

	private boolean alreadySetup = false;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private PrivilegeRepository privilegeRepository;
	// API

	@Override
	@Transactional
	public void onApplicationEvent(final ContextRefreshedEvent event) {
		if (alreadySetup) {
			return;
		}
		log.info("creating intial roles (If Not Created) =>  ADMIN, USER");
		// == create initial roles
		createRoleIfNotFound(RoleName.USER);
//		createRoleIfNotFound(RoleName.ADMIN);
		final Role superAdminRole = createRoleIfNotFound(RoleName.SUPER_ADMIN);
		log.info("creating intial SUPER_ADMIN User (If Not Created) =>  admin");

		// == create initial ADMIN user
		createUserIfNotFound("msrashed100@gmail.com", "admin", "admin", "admin", "admin", "01015090111",
				new ArrayList<Role>(Arrays.asList(superAdminRole)));

		createPrivilegeIfNotFound(PrivilegeName.DICOM_VIEWER);
		createPrivilegeIfNotFound(PrivilegeName.DASHBOARD_VIEW);
		createPrivilegeIfNotFound(PrivilegeName.USERS_VIEW);
		createPrivilegeIfNotFound(PrivilegeName.USERS_EDIT);
		createPrivilegeIfNotFound(PrivilegeName.APPICATION_ENTITY_EDIT);
		createPrivilegeIfNotFound(PrivilegeName.DIRECTORY_WATCHER_EDIT);
		createPrivilegeIfNotFound(PrivilegeName.DICOMS_UPLOADER);
		createPrivilegeIfNotFound(PrivilegeName.DICOMS_SEARCH);
		createPrivilegeIfNotFound(PrivilegeName.DIRECTORY_WATCHER_VIEW);
		createPrivilegeIfNotFound(PrivilegeName.APPICATION_ENTITY_VIEW);

		alreadySetup = true;
	}

	@Transactional
	private final Privilege createPrivilegeIfNotFound(final PrivilegeName name) {
		Privilege privilege = privilegeRepository.findByName(name);
		if (privilege == null) {
			privilege = new Privilege();
			privilege.setName(name);
		}
		privilege = privilegeRepository.save(privilege);
		return privilege;
	}

	@Transactional
	private final Role createRoleIfNotFound(final RoleName name) {
		Role role = roleRepository.findByName(name);
		if (role == null) {
			role = new Role();
			role.setName(name);
		}
		role = roleRepository.save(role);
		return role;
	}

	@Transactional
	private final User createUserIfNotFound(final String email, final String username, final String firstName,
			final String lastName, final String password, final String mobile, final List<Role> roles) {

		Optional<User> userOptional = userRepository.findByUsername(username);
		if (userOptional.isPresent()) {
			return userOptional.get();

		} else {

			User user = new User();
			user.setUsername(username);
			user.setFirstname(firstName);
			user.setLastname(lastName);
			user.setPassword(passwordEncoder.encode(password));
			user.setEmail(email);
			user.setMobile(mobile);
			user.setEnabled(true);
			user.setRoles(roles);
			user = userRepository.save(user);
			return user;
		}

	}

}