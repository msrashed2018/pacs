package com.almustkbal.pacs.repositories;

import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.almustkbal.pacs.domain.Equipment;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

	Equipment findBySeriesPkTBLSeriesID(Long pkTBLSeriesID);

	long countByModality(String modality);

	@Query("SELECT COUNT(e) from Equipment e where e.modality=:modality AND CAST(e.createdDate AS date)  = CAST(:createdDate AS date) ")
	long countByModalityAndCreatedDate(String modality, Date createdDate);

	@Query("SELECT COUNT(e) from Equipment e where e.modality=:modality AND CAST(e.createdDate AS date) BETWEEN CAST(:fromDate AS date) AND  CAST(:toDate AS date)   ")
	long countByModalityAndCreatedDateBetween(String modality, Date fromDate, Date toDate);

}
