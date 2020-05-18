package com.almustkbal.pacs.domain;

import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "PROFILE_USER")
@Getter
@Setter
public class User implements UserDetails {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "USER_ID")
	private Long id;

	@Column(name = "USERNAME", nullable = false, unique = true)
	@NotNull(message = "username must not be null")
	@NotEmpty(message = "username must not be empty")
	private String username;

	@ToString.Exclude
	@Column(name = "password", nullable = false, length = 255)
	@JsonIgnore
	private String password;

	@Column(name = "FIRST_NAME", nullable = false)
	@NotEmpty(message = "firstname must not be empty")
	@NotNull(message = "firstname must not be null")
	private String firstname;

	@Column(name = "LAST_NAME", nullable = false)
	@NotNull(message = "lastname must not be null")
	@NotEmpty(message = "lastname must not be empty")
	private String lastname;

	@Column(name = "mobile"/* , nullable = false */, unique = true)
//	@NotNull(message = "mobile must not be null")
	private String mobile;

	@Column(name = "GENDER")
	@Enumerated(EnumType.STRING)
	private Gender gender;

	@Column(name = "EMAIL", nullable = false, unique = true)
	@NotNull(message = "email must not be null")
	@NotEmpty(message = "email must not be empty")
	@Email(message = "email is not valid")
	private String email;

	@Column(name = "AGE", nullable = false)
	@NotNull(message = "age must not be null")
	@Max(value = 100, message = "max value for age is 100")
	private int age;

	@Column(name = "REGISTERED_DATE")
	@JsonFormat(pattern = "yyyy-MM-dd")
	private Date registeredDate;

	@Column(name = "LAST_LOGIN_TIME")
	@JsonFormat(pattern = "yyyy-MM-dd hh:mm:ss")
	private Date lastlogin;

	@ToString.Exclude
//	@JsonIgnore
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "USER_ROLES", joinColumns = {
			@JoinColumn(name = "USER_ID", referencedColumnName = "USER_ID") }, inverseJoinColumns = {
					@JoinColumn(name = "ROLE_ID", referencedColumnName = "ROLE_ID") })
	private List<Role> roles;

	@ToString.Exclude
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "USER_PRIVILEGES", joinColumns = {
			@JoinColumn(name = "USER_ID", referencedColumnName = "USER_ID") }, inverseJoinColumns = {
					@JoinColumn(name = "PRIVILEGE_ID", referencedColumnName = "PRIVILEGE_ID") })
	private Set<Privilege> privileges;

	@Column(name = "ENABLED")
//	@JsonIgnore
	private boolean enabled = true;

	@Column(name = "ACCOUNT_NON_EXPIRED")
	@JsonIgnore
	private boolean accountNonExpired = true;

	@Column(name = "CREDENTIALS_NON_EXPIRED")
	@JsonIgnore
	private boolean credentialsNonExpired = true;

	@Column(name = "ACCOUNT_NON_LOCKED")
	@JsonIgnore
	private boolean accountNonLocked = true;

	@Override
	@JsonIgnore
	public Collection<? extends GrantedAuthority> getAuthorities() {

		Set<SimpleGrantedAuthority> authorities = new HashSet<>();
		getRoles().forEach(role -> {
			// authorities.add(new SimpleGrantedAuthority(role.getName()));
			authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getName()));
		});
		return authorities;
	}

	@Override
	public String getPassword() {
		return this.password;
	}

	@Override
	public boolean isAccountNonExpired() {
		return this.accountNonExpired;
	}

	@Override
	public boolean isAccountNonLocked() {
		return this.accountNonLocked;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return this.credentialsNonExpired;
	}

	@Override
	public boolean isEnabled() {
		return this.enabled;
	}

}
