package com.almustkbal.pacs.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetailsService;

import com.almustkbal.pacs.dicom.dto.UserFilterDTO;
import com.almustkbal.pacs.domain.UpdateUserRequest;
import com.almustkbal.pacs.domain.User;

public interface UserService extends UserDetailsService {

	Page<User> getUsers(UserFilterDTO userFilterDTO, Pageable pageable);

	User getUserById(Long id);

	User createUser(User user);

	User updateProfile(Long id, User user);

	User updateUser(Long id, UpdateUserRequest updateDTO);

	boolean changePassword(String oldPassword, String newpassword);

	boolean forgetPassword(String username);

	User getCurrentAuthenticatedUser();

	String getCurrentAuthenticatedUsername();

	void disableUser(Long id);

	void updateLastLogin(User user);

	void enableUser(Long id);

}
