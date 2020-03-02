package com.almustkbal.pacs.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.almustkbal.pacs.entities.Study;

public interface StudyRepository extends JpaRepository<Study, Long> {

	Study findByStudyInstanceUID(String studyInstanceUID);

	Study findByPkTBLStudyID(Long pkTBLStudyID);

}
