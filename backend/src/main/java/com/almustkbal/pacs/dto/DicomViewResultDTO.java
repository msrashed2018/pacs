package com.almustkbal.pacs.dto;

import java.util.List;

import com.almustkbal.pacs.entities.Equipment;
import com.almustkbal.pacs.entities.Instance;
import com.almustkbal.pacs.entities.Patient;
import com.almustkbal.pacs.entities.Series;
import com.almustkbal.pacs.entities.Study;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
public class DicomViewResultDTO {
	private Patient patient;
	private Study study;
	private Series series;
	private Equipment equipment;
	private Instance instance;
	private List<TagDTO> allTags;
}
