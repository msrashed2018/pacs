package com.almustkbal.pacs.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.almustkbal.pacs.domain.ApplicationEntity;

public interface ApplicationEntityRepository extends JpaRepository<ApplicationEntity, Long> {

}
