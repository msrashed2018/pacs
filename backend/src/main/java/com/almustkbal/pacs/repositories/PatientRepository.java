package com.almustkbal.pacs.repositories;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.almustkbal.pacs.entities.Patient;

//@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {


	@Query("select patient from Patient patient  join patient.studies study" + " join  study.serieses series"
			+ "  join  series.equipment equipment " + "where patient.patientName LIKE CONCAT('%', :patientName, '%')"
			+ "AND patient.patientSex LIKE CONCAT('%', :gender, '%')"
			+ "AND patient.patientID LIKE CONCAT('%', :patientId, '%')"
			+ "AND equipment.institutionName LIKE CONCAT('%', :instituitionName, '%')"
			+ "AND study.referringPhysicianName LIKE CONCAT('%', :physician, '%')"
			+ "AND equipment.modality IN (:modalities) "
			+ "AND patient.createdDate > :dateFrom AND  patient.createdDate < :dateTo")
	Page<Patient> findByPatientNameAndGenderAndPatientIdAndInstituitionNameAndPhysicianAndModalityAndDateBetween(String patientName, String gender, String patientId, String instituitionName, String physician,
			List<String> modalities, Date dateFrom, Date dateTo, Pageable pageable);
	
	
	Patient findByPatientID(String patientID);

	Patient findByPkTBLPatientID(Long pkTBLPatientID);

	Long deleteByPkTBLPatientID(Long pkTBLPatientID);

}
