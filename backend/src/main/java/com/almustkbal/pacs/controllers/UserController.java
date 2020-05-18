package com.almustkbal.pacs.controllers;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.almustkbal.pacs.dicom.commands.CreateUser;
import com.almustkbal.pacs.dicom.dto.UserFilterDTO;
import com.almustkbal.pacs.domain.Privilege;
import com.almustkbal.pacs.domain.Role;
import com.almustkbal.pacs.domain.UpdateUserRequest;
import com.almustkbal.pacs.domain.User;
import com.almustkbal.pacs.repositories.PrivilegeRepository;
import com.almustkbal.pacs.repositories.RoleRepository;
import com.almustkbal.pacs.security.AesUtils;
import com.almustkbal.pacs.security.Encryption;
import com.almustkbal.pacs.services.UserService;

import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class UserController {
	@Autowired
	private UserService userService;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private PrivilegeRepository privilegeRepository;

	@GetMapping("/users")
	@PreAuthorize("hasRole('ROLE_SUPER_ADMIN') OR  ( hasRole('ROLE_ADMIN') AND hasPrivilege('USERS_VIEW') ) OR hasRole('ROLE_CUSTOMER_SERVICES')")
	@ApiOperation(value = "Retrieve All users...This API require ROLE_ADMIN or ROLE_CUSTOMER_SERVICES", notes = "")
	public Page<User> retrieveAllUsers(UserFilterDTO userFilterDTO, @PageableDefault(size = 30) Pageable pageable) {
		return userService.getUsers(userFilterDTO, pageable);
	}

	@GetMapping("/users/{userId}")
	@PreAuthorize("hasRole('ROLE_SUPER_ADMIN') OR ( hasRole('ROLE_ADMIN') AND hasPrivilege('USERS_VIEW') ) OR hasRole('ROLE_CUSTOMER_SERVICES')")
	@ApiOperation(value = "Retrieve User by ID...This API require ADMIN_ROLE", notes = "")
	public User retrieveUserById(@PathVariable Long userId) {
		return userService.getUserById(userId);
	}

	@PutMapping("/users/{userId}/disable")
	@PreAuthorize("hasRole('ROLE_SUPER_ADMIN') OR ( hasRole('ROLE_ADMIN') AND hasPrivilege('USERS_EDIT') )")
	@ApiOperation(value = "disbale User Account...This API require ADMIN_ROLE", notes = "")
	public void disableUser(@PathVariable Long userId) {
		log.info("Request: user[{}] | data={}", userService.getCurrentAuthenticatedUsername(),
				"[userId=" + userId + "]");
		userService.disableUser(userId);
		log.info("Response: user[{}] | data={}", userService.getCurrentAuthenticatedUsername(), "Void");
	}

	@PutMapping("/users/{userId}/enable")
	@PreAuthorize("hasRole('ROLE_SUPER_ADMIN') OR ( hasRole('ROLE_ADMIN') AND hasPrivilege('USERS_EDIT') )")
	@ApiOperation(value = "enable User Account...This API require ADMIN_ROLE", notes = "")
	public void enableUser(@PathVariable Long userId) {
		log.info("Request: user[{}] | data={}", userService.getCurrentAuthenticatedUsername(),
				"[userId=" + userId + "]");
		userService.enableUser(userId);
		log.info("Response: user[{}] | data={}", userService.getCurrentAuthenticatedUsername(), "Void");
	}

	@PostMapping("/users")
	@PreAuthorize("hasRole('ROLE_SUPER_ADMIN') OR ( hasRole('ROLE_ADMIN') AND hasPrivilege('USERS_EDIT') )")
	@ApiOperation(value = "Create New User...This API require ADMIN_ROLE", notes = "")
	public ResponseEntity<User> createUser(@Valid @RequestBody CreateUser request) {
		log.info("Request: user[{}] | data={}", userService.getCurrentAuthenticatedUsername(), request.toString());
		User user = new User();
		user.setFirstname(request.getFirstname());
		user.setLastname(request.getLastname());
		user.setMobile(request.getMobile());
		user.setGender(request.getGender());
		user.setAge(request.getAge());
		user.setEmail(request.getEmail());
		user.setRegisteredDate(new Date());
		String username = request.getUsername();
		String password = request.getPassword();

		if (Encryption.enabled) {
			// Decrypt parameters
			AesUtils aesUtils = new AesUtils();
			if (username != null)
				username = aesUtils.decrypt(Encryption.salt, Encryption.iv, Encryption.passphrase, username);
			if (password != null)
				password = aesUtils.decrypt(Encryption.salt, Encryption.iv, Encryption.passphrase, password);
		}

		user.setUsername(username);
		user.setPassword(password);

		List<Role> roles = roleRepository.findAll();

		roles.retainAll(request.getRoles());

		Set<Privilege> privileges = null;
		if (request.getPrivileges() != null) {
			List<Privilege> privilegesList = privilegeRepository.findAll();
			privilegesList.retainAll(request.getPrivileges());
			privileges = new HashSet<Privilege>(privilegesList);
		}

		user.setRoles(roles);
		user.setPrivileges(privileges);
		user = userService.createUser(user);
		log.info("Response: user[{}] | data={}", userService.getCurrentAuthenticatedUsername(), user.toString());
		return new ResponseEntity<User>(user, HttpStatus.OK);
	}

	@PutMapping("/users/{userId}")
	@PreAuthorize("hasRole('ROLE_SUPER_ADMIN') OR ( hasRole('ROLE_ADMIN') AND hasPrivilege('USERS_EDIT') )")
	@ApiOperation(value = "Update User...This API require ADMIN_ROLE", notes = "")
	public ResponseEntity<User> updateUser(@PathVariable Long userId, @Valid @RequestBody UpdateUserRequest user) {
		log.info("Request: user[{}] | data={}", userService.getCurrentAuthenticatedUsername(), user.toString());
		User updatedUser = userService.updateUser(userId, user);
		log.info("Response: user[{}] | data={}", userService.getCurrentAuthenticatedUsername(), updatedUser.toString());
		return new ResponseEntity<User>(updatedUser, HttpStatus.OK);
	}

}
