package com.almustkbal.pacs.controllers;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2RefreshToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.almustkbal.pacs.dicom.commands.ChangePassword;
import com.almustkbal.pacs.domain.User;
import com.almustkbal.pacs.security.AesUtils;
import com.almustkbal.pacs.security.Encryption;
import com.almustkbal.pacs.services.UserService;

import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class UserProfileController {

	@Autowired
	private UserService userService;

	@Autowired
//	@Qualifier("jdbcTokenStore")
	private TokenStore tokenStore;

	@GetMapping("/profile")
	@ApiOperation(value = "Retrieve Profile data", notes = "")
	public User retreiveProfile() {
		return userService.getUserById(userService.getCurrentAuthenticatedUser().getId());
	}

	@PutMapping("/profile")
	@ApiOperation(value = "Update Profile", notes = "")
	public User updateProfile(@Valid @RequestBody User user) {
		log.info("Request: user[{}] | data={}", userService.getCurrentAuthenticatedUsername(), user.toString());
		User updatedUser = userService.updateProfile(userService.getCurrentAuthenticatedUser().getId(), user);
		log.info("Response: user[{}] | data={}", userService.getCurrentAuthenticatedUsername(), updatedUser.toString());
		return updatedUser;
	}

	@PutMapping("/profile/changepassword")
	@ApiOperation(value = "Change Password", notes = "")
	public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePassword changePasswordDTO) {
//
		log.info("Request: user[{}] | data={}", userService.getCurrentAuthenticatedUsername(), "[PROTECTED]");
		String oldPassword = changePasswordDTO.getOldPassword();
		String newPassword = changePasswordDTO.getNewPassword();

		if (Encryption.enabled) {
//			String salt = changePasswordDTO.getSalt();
//			String iv = changePasswordDTO.getIv();
//			String passphrase = changePasswordDTO.getPassphrase();

			// Decrypt parameters
			AesUtils aesUtils = new AesUtils();
			if (oldPassword != null)
				oldPassword = aesUtils.decrypt(Encryption.salt, Encryption.iv, Encryption.passphrase, oldPassword);
			if (newPassword != null)
				newPassword = aesUtils.decrypt(Encryption.salt, Encryption.iv, Encryption.passphrase, newPassword);
		}

		Boolean isChanged = userService.changePassword(oldPassword, newPassword);
		log.info("Response: user[{}] | data={}", userService.getCurrentAuthenticatedUsername(), isChanged);
		return new ResponseEntity<Boolean>(isChanged, HttpStatus.OK);
	}

	@RequestMapping(path = "/profile/logout", method = RequestMethod.POST)
	public void logout(HttpServletRequest request, OAuth2Authentication authentication) throws ServletException {
		log.info("Request: user[{}] | data={}", userService.getCurrentAuthenticatedUsername(), "NA");
		OAuth2AuthenticationDetails details = (OAuth2AuthenticationDetails) authentication.getDetails();
		String tokenValue = details.getTokenValue();
		OAuth2AccessToken accessToken = tokenStore.readAccessToken(tokenValue);
		OAuth2RefreshToken refreshToken = accessToken.getRefreshToken();
		tokenStore.removeAccessToken(accessToken);
		tokenStore.removeRefreshToken(refreshToken);
		log.info("Response: user[{}] | data={}", userService.getCurrentAuthenticatedUsername(), "Void");
	}

}
