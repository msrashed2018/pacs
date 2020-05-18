package com.almustkbal.pacs.dto;

import com.almustkbal.pacs.domain.Patient;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
public class DicomViewResultDTO {
	private Patient patient;

}
