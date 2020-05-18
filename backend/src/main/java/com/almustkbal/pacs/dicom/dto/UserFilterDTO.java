package com.almustkbal.pacs.dicom.dto;

import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

import com.almustkbal.pacs.domain.RoleName;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class UserFilterDTO {

	String searchKey = "";

	String name = "";

	String username = "";

	String email = "";

	String mobile = "";

	Boolean enabled;

	@DateTimeFormat(iso = ISO.DATE)
	Date registeredDate;

	List<RoleName> role;

}