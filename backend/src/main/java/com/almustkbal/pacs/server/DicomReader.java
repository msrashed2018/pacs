package com.almustkbal.pacs.server;

import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.dcm4che3.data.Attributes;
import org.dcm4che3.data.Tag;
import org.dcm4che3.data.UID;
import org.dcm4che3.data.VR;
import org.dcm4che3.io.DicomInputStream;
import org.dcm4che3.io.DicomInputStream.IncludeBulkData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DicomReader {

	private static final Logger LOG = LoggerFactory.getLogger(DicomReader.class);

	DateFormat df = new SimpleDateFormat("MM-dd-yyyy HH:mm:ss");

	private Attributes attr = null; // file dataset info
	private Attributes fmi = null; // file metadata info

	public DicomReader() {
	}

	public DicomReader(File file) throws IOException {
		DicomInputStream dis = null;
		try {
			dis = new DicomInputStream(file);
			dis.setIncludeBulkData(IncludeBulkData.URI);
			this.attr = dis.readDataset(-1, -1);
			this.fmi = dis.readFileMetaInformation() != null ? dis.readFileMetaInformation()
					: attr.createFileMetaInformation(UID.ImplicitVRLittleEndian);

		} catch (IOException e) {

			LOG.error(e.getMessage());
			throw e; // what's the point of keeping this file? throw

		} finally {
			try {
				if (dis != null)
					dis.close();
			} catch (IOException ignore) {
				LOG.error(ignore.getMessage(), ignore);
			}
		}
	}

	public Attributes getDataSet() {
		return this.attr;
	}

	public Attributes getMetaData() {
		return this.fmi;
	}

	/**************************
	 * Patient Info
	 **************************************************************************************/
	public String getPatientID() {
//    	this.attr.getString(Integer.parseInt("00100020", 16) );
		return this.attr.getString(Tag.PatientID);
	}

	public String getPatientName() {
		return this.attr.getString(Tag.PatientName);
	}

	public String getPatientSex() {
		return  this.attr.getString(Tag.PatientSex, "");
	}

	public String getPatientAge() {
		return this.attr.getString(Tag.PatientAge);
	}

	public Date getPatientBirthDay() {
		return this.attr.getDate(Tag.PatientBirthDate);
	}

	/**************************
	 * End of Patient Info
	 ***************************************/

	/**********************************************
	 * Study Info
	 *********************************************************************/
	public String getAccessionNumber() {

		return this.attr.getString(Tag.AccessionNumber);
	}

	public String getAdditionalPatientHistory() {
		return this.attr.getString(Tag.AdditionalPatientHistory);
	}

	public String getAdmittingDiagnosesDescription() {
		return this.attr.getString(Tag.AdmittingDiagnosesDescription);
	}

	public String getReferringPhysicianName() {
		return this.attr.getString(Tag.ReferringPhysicianName, "");
	}

	public Date getStudyDateTime() {
		return this.attr.getDate(Tag.StudyDateAndTime);
	}

	public String getStudyID() {
		return this.attr.getString(Tag.StudyID, "");
		
	}

	public String getStudyDescription() {
		return this.attr.getString(Tag.StudyDescription);
	}

	public String getStudyInstanceUID() {
		return this.attr.getString(Tag.StudyInstanceUID);
	}

	public String getStudyPriorityID() {
		return this.attr.getString(Tag.StudyPriorityID);
	}

	public String getStudyStatusID() {
		return this.attr.getString(Tag.StudyStatusID);
	}

	public String getStudyDate() {
		return this.attr.getString(Tag.StudyDate);
	}

	public String getStudyTime() {
		return this.attr.getString(Tag.StudyTime);
	}

	/**********************************************
	 * End of Study Info
	 ***************************************************************/

	/****************************************************
	 * Series Info
	 ***************************************************************/
	public String getBodyPartExamined() {
		return this.attr.getString(Tag.BodyPartExamined);
	}

	public String getLaterality() {
		return this.attr.getString(Tag.Laterality);
	}

	public String getOperatorsName() {
		return this.attr.getString(Tag.OperatorsName);
	}

	public String getPatientPosition() {
		return this.attr.getString(Tag.PatientPosition);
	}

	public String getProtocolName() {
		return this.attr.getString(Tag.ProtocolName);
	}

	public Date getSeriesDateTime() {
		return this.attr.getDate(Tag.SeriesDateAndTime);
	}

	public String getSeriesDate() {
		return this.attr.getString(Tag.SeriesDate);
	}

	public String getSeriesTime() {
		return this.attr.getString(Tag.SeriesTime);
	}

	public String getSeriesDescription() {
		return this.attr.getString(Tag.SeriesDescription);
	}

	public String getSeriesInstanceUID() {
		return this.attr.getString(Tag.SeriesInstanceUID);
	}

	public Integer getSeriesNumber() {
		return this.attr.getInt(Tag.SeriesNumber, 0);
	}

	/****************************************************
	 * End of Series Info
	 **********************************************************/

	/*****************************************************
	 * Equipment Info
	 *************************************************************/
	public String getConversionType() {
		return this.attr.getString(Tag.ConversionType);
	}

	public String getDeviceSerialNumber() {
		return this.attr.getString(Tag.DeviceSerialNumber);
	}

	public String getInstitutionAddress() {
		return this.attr.getString(Tag.InstitutionAddress);
	}

	public String getInstitutionName() {
		return this.attr.getString(Tag.InstitutionName, "");
	}

	public String getInstitutionalDepartmentName() {
		return this.attr.getString(Tag.InstitutionalDepartmentName);
	}

	public String getManufacturer() {
		return this.attr.getString(Tag.Manufacturer);
	}

	public String getManufacturerModelName() {
		return this.attr.getString(Tag.ManufacturerModelName);
	}

	public String getModality() {
		return this.attr.getString(Tag.Modality, "");
	}

	public String getSoftwareVersion() {
		return this.attr.getString(Tag.SoftwareVersions);
	}

	public String getStationName() {
		return this.attr.getString(Tag.StationName);
	}

	/*****************************************************
	 * End of Equipment Info
	 ******************************************************/

	/***********************************************************
	 * Instance Info
	 *********************************************************/
	public Date getAcquisitionDateTime() {
		return this.attr.getDate(Tag.AcquisitionDateAndTime);
	}

	public String getAcquisitionDate() {
		return this.attr.getString(Tag.AcquisitionDate);
	}

	public String getAcquisitionTime() {
		return this.attr.getString(Tag.AcquisitionTime);
	}

	public Date getContentDateTime() {
		return this.attr.getDate(Tag.ContentDateAndTime);
	}

	public String getContentDate() {
		return this.attr.getString(Tag.ContentDate);
	}

	public String getContentTime() {
		return this.attr.getString(Tag.ContentTime);
	}

	public Integer getExposureTime() {
		return this.attr.getInt(Tag.ExposureTime, 0);
	}

	public String getImageOrientation() {
		return this.attr.getString(Tag.ImageOrientation);
	}

	public String getImagePosition() {
		return this.attr.getString(Tag.ImagePosition);
	}

	public String getImageType() {
		return this.attr.getString(Tag.ImageType);
	}

	public Integer getInstanceNumber() {
		return this.attr.getInt(Tag.InstanceNumber, 0);
	}

	public String getKvp() {
		return this.attr.getString(Tag.KVP);
	}

	public String getMediaStorageSopInstanceUID() {
		return this.fmi.getString(Tag.MediaStorageSOPInstanceUID);
	}// InstanceUID -> it is also the file name itself

	public String getTransferSyntaxUID() {
		return this.fmi.getString(Tag.TransferSyntaxUID);
	}

	public String getPatientOrientation() {
		return this.attr.getString(Tag.PatientOrientation);
	}

	public Float getPixelSpacing() {
		return this.attr.getFloat(Tag.PixelSpacing, 0);
	}

	public Float getSliceLocation() {
		return this.attr.getFloat(Tag.SliceLocation, 0);
	}

	public Float getSliceThickness() {
		return this.attr.getFloat(Tag.SliceThickness, 0);
	}

	public String getSopClassUID() {
		return this.attr.getString(Tag.SOPClassUID);
	}

	public String getSOPInstanceUID() {
		return this.attr.getString(Tag.SOPInstanceUID);
	}

	public String getWindowCenter() {
		return this.attr.getString(Tag.WindowCenter);
	}

	public String getWindowWidth() {
		return this.attr.getString(Tag.WindowWidth);
	}

	public Integer getXrayTubeCurrent() {
		return this.attr.getInt(Tag.XRayTubeCurrent, 0);
	}

	// radiation dose data

	public String getAnatomicStructure() {
		return this.attr.getString(Tag.AnatomicStructure);
	}

	public String getTotalTimeOfFluoroscopy() {
		return this.attr.getString(Tag.TotalTimeOfFluoroscopy);
	}

	public String getTotalNumberOfExposures() {
		return this.attr.getString(Tag.TotalNumberOfExposures);
	}

	public String getDistanceSourceToEntrance() {
		return this.attr.getString(Tag.DistanceSourceToEntrance);
	}

	public String getEntranceDose() {
		return this.attr.getString(Tag.EntranceDose);
	}

	public String getEntranceDoseDerivation() {
		return this.attr.getString(Tag.EntranceDoseDerivation);
	}

	public String getExposedArea() {
		return this.attr.getString(Tag.ExposedArea);
	}

	public String getCommentsOnRadiationDose() {
		return this.attr.getString(Tag.CommentsOnRadiationDose);
	}

	public String getExposureDoseSequence() {
		return this.attr.getString(Tag.ExposureDoseSequence);
	}

	public String getRadiationMode() {
		return this.attr.getString(Tag.RadiationMode);
	}

	public String getXRayTubeCurrentInuA() {
		return this.attr.getString(Tag.XRayTubeCurrentInuA);
	}

	public String getFilterMaterial() {
		return this.attr.getString(Tag.FilterMaterial);
	}

	public Integer getXRayTubeCurrent() {
		return this.attr.getInt(Tag.XRayTubeCurrent,0);
	}

	public String getDistanceSourceToDetector() {
		return this.attr.getString(Tag.DistanceSourceToDetector);
	}

	public String getGridFocalDistance() {
		return this.attr.getString(Tag.GridFocalDistance);
	}

	public String getImageAndFluoroscopyAreaDoseProduct() {
		return this.attr.getString(Tag.ImageAndFluoroscopyAreaDoseProduct);
	}

	public String getRadiopharmaceutical() {
		return this.attr.getString(Tag.Radiopharmaceutical);
	}

	public String getRadionuclideTotalDose() {
		return this.attr.getString(Tag.RadionuclideTotalDose);
	}

	public String getRadionuclideHalfLife() {
		return this.attr.getString(Tag.RadionuclideHalfLife);
	}

	public String getBodyPartThickness() {
		return this.attr.getString(Tag.BodyPartThickness);
	}

	public String getCompressionForce() {
		return this.attr.getString(Tag.CompressionForce);
	}

	public String getFilterType() {
		return this.attr.getString(Tag.FilterType);
	}

	public String getEntranceDoseInmGy() {
		return this.attr.getString(Tag.EntranceDoseInmGy);
	}

	public String getHalfValueLayer() {
		return this.attr.getString(Tag.HalfValueLayer);
	}

	public Double getCTDIvol() {
		return this.attr.getDouble(null, Tag.CTDIvol, VR.FD, 0);
	}

	/***************************************************
	 * Instance Info
	 ***********************************************************************/

	@Override
	public String toString() {

		return String.format(
				"[Patient] => Patient ID: %s, Patient Name: %s, Patient Sex: %s, Patient Age: %s, Patient Birthday: %s \n"
						+ "----------------------------------------------------------------------------------------------------------------------\n"
						+ "[Study] => Accession Number: %s, Additional Patient History: %s, Admitting Diagnoses Description: %s, Referring Physician Name: %s, SOP Instance UID: %s, Study Date Time: %s, Study ID: %s, Study Instance UID: %s, Study Priority ID: %s, Study Status ID: %s \n"
						+ "----------------------------------------------------------------------------------------------------------------------\n"
						+ "[Series] => Body Part Examined: %s, Laterality: %s, Operators Name: %s, Patient Position: %s, Protocol Name: %s, Series Date Time: %s, Series Description: %s, Series Instance UID: %s, Series Number: %d \n"
						+ "----------------------------------------------------------------------------------------------------------------------\n"
						+ "[Equipment] => Conversion Type: %s, Institutional Department Name: %s, Device SerialNumber: %s, Instituition Address: %s, Institution Name: %s, Manufacturer: %s, Manufacturer Model Name: %s, Modality: %s, Software Version: %s, Station Name: %s\n"
						+ "----------------------------------------------------------------------------------------------------------------------\n"
						+ "[Instance] --> Acquisition Date Time: %s, Content Date Time: %s, Exposure Time: %s, Image Orientation: %s, Image Position: %s, Image Type: %s, Instance Number: %d, kvp: %s,  Media Storage SOP InstanceUID: %s, TransferSyntax UID: %s, Patient Orientation:  %s, Pixel Spacing: %f, Slice Location: %f, Slice Thickness: %f, SOP Class UID: %s, SOP Instance UID: %s, window Center: %s, window Width: %s, Xray Tube Current: %d \n",
				getPatientID(), getPatientName(), getPatientSex(), getPatientAge(), getPatientBirthDay(),
				getAccessionNumber(), getAdditionalPatientHistory(), getAdmittingDiagnosesDescription(),
				getReferringPhysicianName(), getSOPInstanceUID(), getStudyDateTime(), getStudyID(),
				getStudyInstanceUID(), getStudyPriorityID(), getStudyStatusID(), getBodyPartExamined(), getLaterality(),
				getOperatorsName(), getPatientPosition(), getProtocolName(), getSeriesDateTime(),
				getSeriesDescription(), getSeriesInstanceUID(), getSeriesNumber(), getConversionType(),
				getInstitutionalDepartmentName(), getDeviceSerialNumber(), getInstitutionAddress(),
				getInstitutionName(), getManufacturer(), getManufacturerModelName(), getModality(),
				getSoftwareVersion(), getStationName(), getAcquisitionDateTime(), getContentDateTime(),
				getExposureTime(), getImageOrientation(), getImagePosition(), getImageType(), getInstanceNumber(),
				getKvp(), getMediaStorageSopInstanceUID(), getTransferSyntaxUID(), getPatientOrientation(),
				getPixelSpacing(), getSliceLocation(), getSliceThickness(), getSopClassUID(), getSOPInstanceUID(),
				getWindowCenter(), getWindowWidth(), getXrayTubeCurrent());
	}

}
