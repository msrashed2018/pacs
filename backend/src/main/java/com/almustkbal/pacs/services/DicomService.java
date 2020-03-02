package com.almustkbal.pacs.services;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.almustkbal.pacs.dto.TagDTO;
import com.almustkbal.pacs.entities.Equipment;
import com.almustkbal.pacs.entities.Instance;
import com.almustkbal.pacs.entities.Patient;
import com.almustkbal.pacs.entities.Series;
import com.almustkbal.pacs.entities.Study;
import com.almustkbal.pacs.server.DicomReader;

public interface DicomService {

	Page<Patient> getPatients(String patientName, String gender, String patientId, String instituitionName,
			String physician, List<String> modalities, Date dateFrom, Date dateTo, Pageable pageable);

	Patient buildEntities(DicomReader reader, boolean save);

	Patient buildPatient(DicomReader reader, boolean save);

	Study buildStudy(DicomReader reader, Patient patient, boolean save);

	Series buildSeries(DicomReader reader, Study study, boolean save);

	Equipment buildEquipment(DicomReader reader, Series series, boolean save);

	Instance buildInstance(DicomReader reader, Series series, boolean save);

	void deletePatient(Long pkTBLPatientID);

	List<TagDTO> getDicomTags(DicomReader reader);

}
