package com.almustkbal.pacs.services;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.almustkbal.pacs.dicom.commands.DicomFilter;
import com.almustkbal.pacs.domain.Patient;

public interface DicomService {

	Page<Patient> getPatients(DicomFilter dicomFilter, Pageable pageable);

	Patient buildAndSaveEntities(File dicomFile);

	Patient buildEntities(File dicomFile) throws IOException;

//	Patient buildPatient(DicomReader reader);
//
//	Study buildStudy(DicomReader reader, Patient patient);
//
//	Series buildSeries(DicomReader reader, Study study);
//
//	Equipment buildEquipment(DicomReader reader, Series series);
//
//	Instance buildInstance(DicomReader reader, Series series, boolean save);

	void mergePatient(String patientId, List<String> patientIds);

	void deletePatient(String pkTBLPatientID);

//	List<TagDTO> getDicomTags(DicomReader reader);

}
