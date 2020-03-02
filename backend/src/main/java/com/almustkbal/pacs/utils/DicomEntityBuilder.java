package com.almustkbal.pacs.utils;

import java.util.Date;

import com.almustkbal.pacs.entities.Equipment;
import com.almustkbal.pacs.entities.Instance;
import com.almustkbal.pacs.entities.Patient;
import com.almustkbal.pacs.entities.Radiation;
import com.almustkbal.pacs.entities.Series;
import com.almustkbal.pacs.entities.Study;

public class DicomEntityBuilder {

	public static Patient newPatient(String patientAge, Date patientBirthday, String patientID, String patientName,
			String patientSex) {

		Patient patient = new Patient();
		patient.setPatientAge(patientAge);
		patient.setPatientBirthday(patientBirthday);
		patient.setPatientID(patientID);
		patient.setPatientName(patientName);
		patient.setPatientSex(patientSex);

		return patient;
	}

	public static Study newStudy(String accessionNumber, String additionalPatientHistory,
			String admittingDiagnosesDescription, String referringPhysicianName, Date studyDateTime, String studyID,
			String studyDescription, String studyInstanceUID, String studyPriorityID, String studyStatusID) {

		Study study = new Study();
		study.setAccessionNumber(accessionNumber);
		study.setAdditionalPatientHistory(additionalPatientHistory);
		study.setAdmittingDiagnosesDescription(admittingDiagnosesDescription);
		study.setReferringPhysicianName(referringPhysicianName);
		study.setStudyDateTime(studyDateTime);
		study.setStudyID(studyID);
		study.setStudyDescription(studyDescription);
		study.setStudyInstanceUID(studyInstanceUID);
		study.setStudyPriorityID(studyPriorityID);
		study.setStudyStatusID(studyStatusID);

		return study;
	}

	public static Series newSeries(String bodyPartExamined, String laterality, String operatorsName,
			String patientPosition, String protocolName, Date seriesDateTime, String seriesDescription,
			String seriesInstanceUID, Integer seriesNumber) {

		Series series = new Series();
		series.setBodyPartExamined(bodyPartExamined);
		series.setLaterality(laterality);
		series.setOperatorsName(operatorsName);
		series.setPatientPosition(patientPosition);
		series.setProtocolName(protocolName);
		series.setSeriesDateTime(seriesDateTime);
		series.setSeriesDescription(seriesDescription);
		series.setSeriesInstanceUID(seriesInstanceUID);
		series.setSeriesNumber(seriesNumber);

		return series;
	}

	public static Equipment newEquipment(String conversionType, String deviceSerialNumber, String institutionAddress,
			String institutionName, String institutionalDepartmentName, String manufacturer,
			String manufacturerModelName, String modality, String softwareVersion, String stationName) {

		Equipment equipment = new Equipment();
		equipment.setConversionType(conversionType);
		equipment.setDeviceSerialNumber(deviceSerialNumber);
		equipment.setInstitutionAddress(institutionAddress);
		equipment.setInstitutionName(institutionName);
		equipment.setInstitutionalDepartmentName(institutionalDepartmentName);
		equipment.setManufacturer(manufacturer);
		equipment.setManufacturerModelName(manufacturerModelName);
		equipment.setModality(modality);
		equipment.setSoftwareVersion(softwareVersion);
		equipment.setStationName(stationName);

		return equipment;
	}

	public static Instance newInstance(Date acquisitionDateTime, Date contentDateTime, Integer exposureTime,
			String imageOrientation, String imagePosition, String imageType, Integer instanceNumber, String kvp,
			String mediaStorageSopInstanceUID, String patientOrientation, Float pixelSpacing, Float sliceLocation,
			Float sliceThickness, String sopClassUID, String sopInstanceUID, String transferSyntaxUID,
			String windowCenter, String windowWidth, Integer xrayTubeCurrent) {

		Instance instance = new Instance();
		instance.setAcquisitionDateTime(acquisitionDateTime);
		instance.setContentDateTime(contentDateTime);
		instance.setExposureTime(exposureTime);
		instance.setImageOrientation(imageOrientation);
		instance.setImagePosition(imagePosition);
		instance.setImageType(imageType);
		instance.setInstanceNumber(instanceNumber);
		instance.setKvp(kvp);
		instance.setMediaStorageSopInstanceUID(mediaStorageSopInstanceUID);
		instance.setPatientOrientation(patientOrientation);
		instance.setPixelSpacing(pixelSpacing);
		instance.setSliceLocation(sliceLocation);
		instance.setSliceThickness(sliceThickness);
		instance.setSopClassUID(sopClassUID);
		instance.setSopInstanceUID(sopInstanceUID);
		instance.setTransferSyntaxUID(transferSyntaxUID);
		instance.setWindowCenter(windowCenter);
		instance.setWindowWidth(windowWidth);
		instance.setXrayTubeCurrent(xrayTubeCurrent);

		return instance;
	}

	public static Radiation newRadiation(String totalTimeOfFluoroscopy, String totalNumberOfExposures,
			String distanceSourceToEntrance, String entranceDose, String entranceDoseDerivation, String exposedArea,
			String commentsOnRadiationDose, String exposureDoseSequence, String radiationMode,
			String xRayTubeCurrentInuA, String filterMaterial, Integer xRayTubeCurrent,
			String distanceSourceToDetector, String gridFocalDistance, String imageAndFluoroscopyAreaDoseProduct,
			String radiopharmaceutical, String radionuclideTotalDose, String radionuclideHalfLife,
			String bodyPartThickness, String compressionForce, String filterType, String entranceDoseInmGy,
			String halfValueLayer, Double cTDIvol) {

		Radiation radiation = new Radiation();
		radiation.setTotalTimeOfFluoroscopy(totalTimeOfFluoroscopy);
		radiation.setTotalNumberOfExposures(totalNumberOfExposures);
		radiation.setDistanceSourceToEntrance(distanceSourceToEntrance);
		radiation.setEntranceDose(entranceDose);
		radiation.setEntranceDoseDerivation(entranceDoseDerivation);
		radiation.setExposedArea(exposedArea);
		radiation.setCommentsOnRadiationDose(commentsOnRadiationDose);
		radiation.setExposureDoseSequence(exposureDoseSequence);
		radiation.setRadiationMode(radiationMode);
		radiation.setXRayTubeCurrentInuA(xRayTubeCurrentInuA);
		radiation.setFilterMaterial(filterMaterial);
		radiation.setXRayTubeCurrent(xRayTubeCurrent);
		radiation.setDistanceSourceToDetector(distanceSourceToDetector);
		radiation.setGridFocalDistance(gridFocalDistance);
		radiation.setImageAndFluoroscopyAreaDoseProduct(imageAndFluoroscopyAreaDoseProduct);
		radiation.setRadiopharmaceutical(radiopharmaceutical);
		radiation.setRadionuclideTotalDose(radionuclideTotalDose);
		radiation.setRadionuclideHalfLife(radionuclideHalfLife);
		radiation.setBodyPartThickness(bodyPartThickness);
		radiation.setCompressionForce(compressionForce);
		radiation.setFilterType(filterType);
		radiation.setEntranceDoseInmGy(entranceDoseInmGy);
		radiation.setHalfValueLayer(halfValueLayer);
		radiation.setCTDIvol(cTDIvol);
		return radiation;
	}

}
