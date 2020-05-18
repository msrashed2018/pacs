package com.almustkbal.pacs.controllers;

import java.util.Calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.almustkbal.pacs.dicom.dto.CTModalityStats;
import com.almustkbal.pacs.dicom.dto.DFModalityStats;
import com.almustkbal.pacs.dicom.dto.DXModalityStats;
import com.almustkbal.pacs.dicom.dto.DashBoardDTO;
import com.almustkbal.pacs.dicom.dto.MGModalityStats;
import com.almustkbal.pacs.dicom.dto.PETModalityStats;
import com.almustkbal.pacs.dicom.dto.PatientStats;
import com.almustkbal.pacs.dicom.dto.StudyStats;
import com.almustkbal.pacs.model.ModalityName;
import com.almustkbal.pacs.repositories.EquipmentRepository;
import com.almustkbal.pacs.repositories.PatientRepository;
import com.almustkbal.pacs.repositories.StudyRepository;

import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class DashboardController {

	@Autowired
	PatientRepository patientRepository;

	@Autowired
	StudyRepository studyRepository;

	@Autowired
	EquipmentRepository equipmentRepository;

	@GetMapping("/dashboard/stats")
	@PreAuthorize("hasRole('ROLE_SUPER_ADMIN') OR ( hasRole('ROLE_USER') AND hasPrivilege('DASHBOARD_VIEW') ) ")
	@ApiOperation(value = "This API require ADMIN_ROLE", notes = "")
	public DashBoardDTO retreiveDashboardStats() {

		DashBoardDTO dashBoardDTO = new DashBoardDTO();

		Calendar today = Calendar.getInstance();
		Calendar yasterday = Calendar.getInstance();
		Calendar lastweek = Calendar.getInstance();
		yasterday.set(Calendar.DAY_OF_MONTH, today.get(Calendar.DAY_OF_MONTH) - 1);
		lastweek.set(Calendar.WEEK_OF_MONTH, today.get(Calendar.WEEK_OF_MONTH) - 1);

		log.info("today={}", today.getTime().toString());
		log.info("yasterday={}", yasterday.getTime().toString());
		log.info("lastweek={}", lastweek.getTime().toString());

		PatientStats patientStats = new PatientStats();
		patientStats.setTotal(patientRepository.count());
		patientStats.setYasterday(patientRepository.countByCreatedDate(yasterday.getTime()));
		patientStats.setLastweek(patientRepository.countByCreatedDateBetween(lastweek.getTime(), today.getTime()));

		StudyStats studyStats = new StudyStats();
		studyStats.setTotal(studyRepository.count());
		studyStats.setYasterday(studyRepository.countByCreatedDate(yasterday.getTime()));
		studyStats.setLastweek(studyRepository.countByCreatedDateBetween(lastweek.getTime(), today.getTime()));

		CTModalityStats ctModalityStats = new CTModalityStats();
		ctModalityStats.setTotal(equipmentRepository.countByModality(ModalityName.CT.toString()));
		ctModalityStats.setYasterday(
				equipmentRepository.countByModalityAndCreatedDate(ModalityName.CT.toString(), yasterday.getTime()));
		ctModalityStats.setLastweek(equipmentRepository.countByModalityAndCreatedDateBetween(ModalityName.CT.toString(),
				lastweek.getTime(), today.getTime()));

		DFModalityStats dfModalityStats = new DFModalityStats();
		dfModalityStats.setTotal(equipmentRepository.countByModality(ModalityName.DF.toString()));
		dfModalityStats.setYasterday(
				equipmentRepository.countByModalityAndCreatedDate(ModalityName.DF.toString(), yasterday.getTime()));
		dfModalityStats.setLastweek(equipmentRepository.countByModalityAndCreatedDateBetween(ModalityName.DF.toString(),
				lastweek.getTime(), today.getTime()));

		DXModalityStats dxModalityStats = new DXModalityStats();
		dxModalityStats.setTotal(equipmentRepository.countByModality(ModalityName.DX.toString()));
		dxModalityStats.setYasterday(
				equipmentRepository.countByModalityAndCreatedDate(ModalityName.DX.toString(), yasterday.getTime()));
		dxModalityStats.setLastweek(equipmentRepository.countByModalityAndCreatedDateBetween(ModalityName.DX.toString(),
				lastweek.getTime(), today.getTime()));

		MGModalityStats mgModalityStats = new MGModalityStats();
		mgModalityStats.setTotal(equipmentRepository.countByModality(ModalityName.MG.toString()));
		mgModalityStats.setYasterday(
				equipmentRepository.countByModalityAndCreatedDate(ModalityName.MG.toString(), yasterday.getTime()));
		mgModalityStats.setLastweek(equipmentRepository.countByModalityAndCreatedDateBetween(ModalityName.MG.toString(),
				lastweek.getTime(), today.getTime()));

		PETModalityStats petModalityStats = new PETModalityStats();
		petModalityStats.setTotal(equipmentRepository.countByModality(ModalityName.PET.toString()));
		petModalityStats.setYasterday(
				equipmentRepository.countByModalityAndCreatedDate(ModalityName.PET.toString(), yasterday.getTime()));
		petModalityStats.setLastweek(equipmentRepository.countByModalityAndCreatedDateBetween(
				ModalityName.PET.toString(), lastweek.getTime(), today.getTime()));

		dashBoardDTO.setCtModalityStats(ctModalityStats);
		dashBoardDTO.setDfModalityStats(dfModalityStats);
		dashBoardDTO.setDxModalityStats(dxModalityStats);
		dashBoardDTO.setMgModalityStats(mgModalityStats);
		dashBoardDTO.setPatientStats(patientStats);
		dashBoardDTO.setPetModalityStats(petModalityStats);
		dashBoardDTO.setStudyStats(studyStats);
		return dashBoardDTO;
	}

}
