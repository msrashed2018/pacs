package com.almustkbal.pacs.services;


import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.almustkbal.pacs.dicom.domain.Dicom;
import com.almustkbal.pacs.dicom.dto.DicomDto;
import com.almustkbal.pacs.dto.TagDTO;
import com.almustkbal.pacs.server.DicomReader;

public interface DicomMongoService {
	
	List<TagDTO> getTagsFromDicom(DicomReader reader);
	
	Page<DicomDto> getDicoms(Pageable page);
	
	Dicom createDicom(DicomReader reader);
	
	Dicom getDicom(long dicomId);
	
	void  deleteDicom(long dicomId);
	
}
