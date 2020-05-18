package com.almustkbal.pacs.domain;

import java.util.List;
import java.util.Set;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.Data;

@Data
public class UpdateUserRequest {

	private String username;

	@NotEmpty(message = "firstname must not be empty")
	@NotNull(message = "firstname must not be null")
	private String firstname;

	@NotNull(message = "lastname must not be null")
	@NotEmpty(message = "lastname must not be empty")
	private String lastname;

	@NotNull(message = "mobile number must not be null")
	@NotEmpty(message = "mobile number must not be empty")
	private String mobile;

//	@NotNull(message = "idNumber must not be null")
//	@NotEmpty(message = "idNumber must not be empty")
//	private String idNumber;

	@NotEmpty(message = "email must not be empty")
	@Email(message = "email is not valid")
	private String email;

//	@NotNull(message = "age must not be null")
//	@Max(value = 100, message = "max value for age is 100")
//	private int age;

//	private String passportNumber;
//	private String reportingManager;
//
//	private String annualIncome;
//
//	private String intMobile;

	private Gender gender;

//	@JsonFormat(pattern = "yyyy-MM-dd")
//	private Date birthdate;

	@Size(min = 1, message = "roles are missing. at least one role is required")
	@NotNull(message = "roles must not be null")
	private List<Role> roles;

	private Set<Privilege> privileges;
}
