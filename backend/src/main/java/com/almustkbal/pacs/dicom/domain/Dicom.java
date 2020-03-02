package com.almustkbal.pacs.dicom.domain;

import java.util.Date;

import javax.persistence.Id;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
@Document(collection = "dicoms")
public class Dicom {

	@Id
	private String id;

	private Date createdDate = new Date();

	private Date modifiedDate = new Date();

	@Indexed()
	private String patientID;

	@Indexed()
	private String patientName;

	private String patientSex;

	private Date patientBirthday;

	private String patientAge;

	private String studyID;

	private String studyDescription;

	private String studyInstanceUID;

	private String accessionNumber;

	private String studyDate;
	
	private String studyTime;

	private String referringPhysicianName;

	private String additionalPatientHistory;

	private String admittingDiagnosesDescription;

	private String studyStatusID;

	private String studyPriorityID;
	
	private String seriesInstanceUID;
	
	private Integer seriesNumber;
	
	private String seriesDescription;	
		
	private String bodyPartExamined;
	
	private String patientPosition;
	
	private String laterality;
	
	private String protocolName;
	
	private String operatorsName;
	
	private String seriesDate;
	
	private String seriesTime;
	
	private String sopInstanceUID;
	
	private String sopClassUID;
	
	private Integer instanceNumber;
	
	private String patientOrientation;
	
	private String mediaStorageSopInstanceUID;
	
	private String transferSyntaxUID;	

	private String acquisitionDate;
	
	private String acquisitionTime;
	
	private String imageType;
	
	private Float pixelSpacing;
	
	private String imageOrientation;
	
	private String imagePosition;
	
	private Float sliceThickness;
	
	private Float sliceLocation;
	
	private String windowCenter;
	
	private String windowWidth;
	
	private Integer xrayTubeCurrent;
	
	private Integer exposureTime;
	
	private String kvp;
	
	private String contentDate;
	
	private String contentTime;
	
	@Indexed()
	private String modality;
	
	private String conversionType;
	
	private String stationName;
	
	@Indexed()
	private String institutionName;
	
	private String institutionAddress;
	
	private String institutionalDepartmentName;
	
	private String manufacturer;
	
	private String manufacturerModelName;
	
	private String softwareVersion;
	
	private String deviceSerialNumber;

}
