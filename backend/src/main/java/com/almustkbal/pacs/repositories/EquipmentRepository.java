package com.almustkbal.pacs.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.almustkbal.pacs.entities.Equipment;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

	Equipment findBySeriesPkTBLSeriesID(Long pkTBLSeriesID);

}
