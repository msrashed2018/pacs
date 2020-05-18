package com.almustkbal.pacs.dicom.commands;

import java.util.List;
import java.util.Set;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.almustkbal.pacs.domain.Gender;
import com.almustkbal.pacs.domain.Privilege;
import com.almustkbal.pacs.domain.Role;

import lombok.Data;

@Data
public class CreateUser {

	private String username;

//	@ToString.Exclude
	private String password;

	@NotEmpty(message = "firstname must not be empty")
	@NotNull(message = "firstname must not be null")
	private String firstname;

	@NotNull(message = "lastname must not be null")
	@NotEmpty(message = "lastname must not be empty")
	private String lastname;

	@NotNull(message = "mobile number must not be null")
	@NotEmpty(message = "mobile number must not be empty")
	private String mobile;

	@NotEmpty(message = "email must not be empty")
	@Email(message = "email is not valid")
	private String email;

	@NotNull(message = "age must not be null")
	private int age;

	private Gender gender;

	@Size(min = 1, message = "roles are missing. at least one role is required")
	@NotNull(message = "roles must not be null")
	private List<Role> roles;

	private Set<Privilege> privileges;

}
