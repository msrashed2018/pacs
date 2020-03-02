package com.almustkbal.pacs.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import lombok.Data;
import lombok.Setter;

@Entity
@Table(name = "APPLICATION_ENTITY")
@Data
@Setter

public class ApplicationEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "ID")
	private long id;

	@Column(name = "title", nullable = false, unique = true)
	@NotNull(message = "title name must not be null")
	@NotEmpty(message = "title name must not be empty")
	private String title;
	
	@Column(name = "HOSTNAME", nullable = false)
	@NotNull(message = "hostname name must not be null")
	@Pattern(regexp = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$", message = "Invalid Hostname")
	private String hostname;
	
	@Column(name = "PORT", nullable = false, unique = true)
	@NotNull(message = "port name must not be null")
	@Min(value = 1024, message = "port must be between 1024 and 49151")
	@Max(value = 49151, message = "port must be between 1024 and 49151")
	private int port;
	
	@Column(name = "DESCRIPTION")
	private String description;
	
	
	@Column(name = "STORAGE_PATH", nullable = false)
	@NotNull(message = "storagePath name must not be null")
	@NotEmpty(message = "storagePath name must not be empty")
	private String storagePath;

	@Column(name = "STATUS", nullable = false)
	private boolean status =false;
	
	@Override
	public String toString() {
		return "ApplicationEntity [title=" + title + ", hostname=" + hostname + ", port=" + port + ", description="
				+ description + ", storagePath=" + storagePath + "]";
	}
	
	

}
