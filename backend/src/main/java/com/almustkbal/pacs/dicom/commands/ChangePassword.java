package com.almustkbal.pacs.dicom.commands;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePassword {

	@NotNull(message = "oldPassword must not be null")
	@NotEmpty(message = "oldPassword must not be empty")
	String oldPassword;

	@NotNull(message = "newPassword must not be null")
	@NotEmpty(message = "newPassword must not be empty")
	String newPassword;

//	String iv;
//
//	String passphrase;
//
//	String salt;
}
