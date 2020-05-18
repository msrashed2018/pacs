package com.almustkbal.pacs.dicom.dto;

import lombok.Data;

@Data
public class DashBoardDTO {

	private CTModalityStats ctModalityStats;
	private MGModalityStats mgModalityStats;
	private DXModalityStats dxModalityStats;
	private DFModalityStats dfModalityStats;
	private PETModalityStats petModalityStats;
	private PatientStats patientStats;
	private StudyStats studyStats;

}
