package com.almustkbal.pacs.dicom.dto;

import lombok.Data;

@Data
public class PatientStats {

	private long total;
	private long yasterday;
	private long lastweek;
}
