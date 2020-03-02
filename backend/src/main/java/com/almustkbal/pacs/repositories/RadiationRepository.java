package com.almustkbal.pacs.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.almustkbal.pacs.entities.Radiation;

public interface RadiationRepository extends JpaRepository<Radiation, Long> {


}
