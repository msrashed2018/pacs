/**
 * 
 */
package com.almustkbal.pacs.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.almustkbal.pacs.dicom.domain.Dicom;
import com.almustkbal.pacs.dicom.dto.DicomDto;
import com.almustkbal.pacs.dicom.repository.DicomMongoRepository;
import com.almustkbal.pacs.dto.TagDTO;
import com.almustkbal.pacs.server.DicomReader;
import com.almustkbal.pacs.services.DicomMongoService;

/**
 * @author mohamedsalah
 *
 */
@Service
public class DicomMongoServiceImpl implements DicomMongoService {

	@Autowired
	private DicomMongoRepository dicomRepository;
	
	
	@Override
	public List<TagDTO> getTagsFromDicom(DicomReader reader) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Page<DicomDto> getDicoms(Pageable page) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Dicom createDicom(DicomReader reader) {
		
		Dicom dicom = new Dicom();
		dicom.setPatientID(reader.getPatientID ());
	    dicom.setPatientName(reader.getPatientName());
	    dicom.setPatientSex(reader.getPatientSex());
	    dicom.setPatientAge(reader.getPatientAge());
	    dicom.setAccessionNumber(reader.getAccessionNumber());
	    dicom.setAdditionalPatientHistory(reader.getAdditionalPatientHistory());
	    dicom.setAdmittingDiagnosesDescription(reader.getAdmittingDiagnosesDescription());
	    dicom.setReferringPhysicianName(reader.getReferringPhysicianName());    
	    dicom.setStudyDate(reader.getStudyDate());
		dicom.setStudyTime(reader.getStudyTime());
	    dicom.setStudyID(reader.getStudyID());
	    dicom.setStudyDescription(reader.getStudyDescription());
	    dicom.setStudyInstanceUID(reader.getStudyInstanceUID());
	    dicom.setStudyPriorityID(reader.getStudyPriorityID());
	    dicom.setStudyStatusID(reader.getStudyStatusID());dicom.setBodyPartExamined(reader.getBodyPartExamined());
	    dicom.setLaterality(reader.getLaterality());    
	    dicom.setOperatorsName(reader.getOperatorsName());
	    dicom.setPatientPosition(reader.getPatientPosition());
	    dicom.setProtocolName(reader.getProtocolName());
	    dicom.setSeriesDate(reader.getSeriesDate());
	    dicom.setSeriesDescription(reader.getSeriesDescription());
	    dicom.setSeriesInstanceUID(reader.getSeriesInstanceUID());
	    dicom.setSeriesNumber(reader.getSeriesNumber());dicom.setConversionType(reader.getConversionType());    
	    dicom.setDeviceSerialNumber(reader.getDeviceSerialNumber());
	    dicom.setInstitutionAddress(reader.getInstitutionAddress());
	    dicom.setInstitutionName(reader.getInstitutionName());
	    dicom.setInstitutionalDepartmentName(reader.getInstitutionalDepartmentName());
	    dicom.setManufacturer(reader.getManufacturer());
	    dicom.setManufacturerModelName(reader.getManufacturerModelName());
	    dicom.setModality(reader.getModality());
	    dicom.setSoftwareVersion(reader.getSoftwareVersion());
	    dicom.setStationName(reader.getStationName());
	    dicom.setAcquisitionDate(reader.getAcquisitionDate());
	    dicom.setAcquisitionTime(reader.getAcquisitionTime());
	    dicom.setContentDate(reader.getContentDate());
		dicom.setContentTime(reader.getContentTime());
	    dicom.setExposureTime(reader.getExposureTime());
	    dicom.setImageOrientation(reader.getImageOrientation());
	    dicom.setImagePosition(reader.getImagePosition());
	    dicom.setImageType(reader.getImageType());
	    dicom.setInstanceNumber(reader.getInstanceNumber());
	    dicom.setKvp(reader.getKvp());
	    dicom.setMediaStorageSopInstanceUID(reader.getMediaStorageSopInstanceUID());
	    dicom.setTransferSyntaxUID(reader.getTransferSyntaxUID());
	    dicom.setPatientOrientation(reader.getPatientOrientation());
	    dicom.setPixelSpacing(reader.getPixelSpacing());
	    dicom.setSliceLocation(reader.getSliceLocation());
	    dicom.setSliceThickness(reader.getSliceThickness());
	    dicom.setSopClassUID(reader.getSopClassUID());
	    dicom.setSopInstanceUID(reader.getSOPInstanceUID());
	    dicom.setWindowCenter(reader.getWindowCenter());
	    dicom.setWindowWidth(reader.getWindowWidth());
	    dicom.setXrayTubeCurrent(reader.getXrayTubeCurrent());
		dicom.setPatientBirthday(reader.getPatientBirthDay());
		
		return dicomRepository.save(dicom);
	}

	@Override
	public Dicom getDicom(long dicomId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void deleteDicom(long dicomId) {
		// TODO Auto-generated method stub
		
	}

}
