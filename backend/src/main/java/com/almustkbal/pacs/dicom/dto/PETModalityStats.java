package com.almustkbal.pacs.dicom.dto;

import lombok.Data;

@Data
public class PETModalityStats {
	private long total;
	private long yasterday;
	private long lastweek;
}
