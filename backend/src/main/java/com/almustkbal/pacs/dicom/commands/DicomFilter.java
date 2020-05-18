package com.almustkbal.pacs.dicom.commands;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class DicomFilter {

	List<String> modality = new ArrayList<String>();

	String patientName = "";

	String gender = "";

	String patientId;

	String instituitionName = "";

	String physician = "";

	@DateTimeFormat(iso = ISO.DATE)
	private Date fromDate;

	@DateTimeFormat(iso = ISO.DATE)
	private Date toDate;

}