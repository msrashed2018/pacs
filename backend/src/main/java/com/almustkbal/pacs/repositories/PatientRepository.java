package com.almustkbal.pacs.repositories;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.almustkbal.pacs.domain.Patient;

//@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

	@Query("select distinct patient from Patient patient  join patient.studies study" + " join  study.serieses series"
			+ "  join  series.equipment equipment " + "where patient.patientName LIKE CONCAT('%', :patientName, '%')"
			+ "AND patient.patientSex LIKE CONCAT('%', :gender , '%')"
			+ "AND patient.patientID LIKE CONCAT('%', :patientId , '%')"
			+ "AND equipment.institutionName LIKE CONCAT('%', :instituitionName, '%')"
			+ "AND study.referringPhysicianName LIKE CONCAT('%', :physician, '%')"
			+ "AND equipment.modality IN (:modalities) "
			+ " AND (:fromDate is null or :toDate is null or ( CAST(patient.createdDate AS date) BETWEEN CAST(:fromDate AS date) AND  CAST(:toDate AS date) ) )")
	Page<Patient> findPatients(String patientName, String gender, String patientId, String instituitionName,
			String physician, List<String> modalities, Date fromDate, Date toDate, Pageable pageable);

	Patient findByPatientID(String patientID);

	Patient findByPkTBLPatientID(Long pkTBLPatientID);

	List<Patient> findByPatientIDIn(List<String> patientID);

	@Modifying
//	@Transactional
	@Query(value = "delete from Patient p where p.patientID = :patientID")
	int deleteByPatientID(String patientID);

	@Query("SELECT COUNT(p) from Patient p where CAST(p.createdDate AS date)  = CAST(createdDate AS date) ")
	long countByCreatedDate(Date createdDate);

	@Query("SELECT COUNT(p) from Patient p where CAST(p.createdDate AS date) BETWEEN CAST(:fromDate AS date) AND  CAST(:toDate AS date)   ")
	long countByCreatedDateBetween(Date fromDate, Date toDate);

}
