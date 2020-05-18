package com.almustkbal.pacs.repositories;

import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.almustkbal.pacs.domain.Study;

public interface StudyRepository extends JpaRepository<Study, Long> {

	Study findByStudyInstanceUID(String studyInstanceUID);

	Study findByPkTBLStudyID(Long pkTBLStudyID);

	@Query("SELECT COUNT(s) from Study s where CAST(s.createdDate AS date)  = CAST(createdDate AS date) ")
	long countByCreatedDate(Date createdDate);

	@Query("SELECT COUNT(s) from Study s where CAST(s.createdDate AS date) BETWEEN CAST(:fromDate AS date) AND  CAST(:toDate AS date)   ")
	long countByCreatedDateBetween(Date fromDate, Date toDate);

}
