package com.almustkbal.pacs.services;

import org.springframework.data.domain.Pageable;

import com.almustkbal.pacs.entities.ApplicationEntity;

import java.util.List;

import org.springframework.data.domain.Page;

public interface ApplicationEntityService {

	List<ApplicationEntity> getAllApplicationEntities();

	Page<ApplicationEntity> getApplicationEntities(Pageable pageable);

	ApplicationEntity getApplicationEntityById(long id);

	ApplicationEntity createApplicationEntity(ApplicationEntity ApplicationEntity);

	ApplicationEntity updateApplicationEntity(long id, ApplicationEntity ApplicationEntity);

	void deleteApplicationEntity(long id);

	void startApplicationEntity(long id);

	void stopApplicationEntity(long id);
}
