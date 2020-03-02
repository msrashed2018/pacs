package com.almustkbal.pacs.controllers;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.almustkbal.pacs.entities.ApplicationEntity;
import com.almustkbal.pacs.services.ApplicationEntityService;

@CrossOrigin(origins = "*")
@RestController
public class ApplicationEntityController {
	@Autowired
	private ApplicationEntityService applicationEntityService;
	
	@GetMapping("/application-entities")
	public Page<ApplicationEntity> retrieveAllApplicationEntities(Pageable pageable) {
		return applicationEntityService.getApplicationEntities(pageable);
	}

	@GetMapping("/application-entities/{applicationEntityId}")
	public ApplicationEntity retrieveApplicationEntityById(@PathVariable long applicationEntityId) {
		return applicationEntityService.getApplicationEntityById(applicationEntityId);
	}

	@DeleteMapping("/application-entities/{applicationEntityId}")
	public void deleteApplicationEntity(@PathVariable long applicationEntityId) {
		applicationEntityService.deleteApplicationEntity(applicationEntityId);
	}

	@PostMapping("/application-entities")
	public ResponseEntity<ApplicationEntity> createApplicationEntity(@Valid @RequestBody ApplicationEntity applicationEntity) {

		ApplicationEntity createdApplicationEntity = applicationEntityService.createApplicationEntity(applicationEntity);
		return new ResponseEntity<ApplicationEntity>(createdApplicationEntity, HttpStatus.OK);

	}

	@PutMapping("/application-entities/{applicationEntityId}")
	public ResponseEntity<ApplicationEntity> updateApplicationEntity(@PathVariable int applicationEntityId, @Valid @RequestBody ApplicationEntity applicationEntity) {
		ApplicationEntity updatedApplicationEntity = applicationEntityService.updateApplicationEntity(applicationEntityId, applicationEntity);
		return new ResponseEntity<ApplicationEntity>(updatedApplicationEntity, HttpStatus.OK);
	}
	
	@PutMapping("/application-entities/{applicationEntityId}/start")
	public void startApplicationEntity(@PathVariable int applicationEntityId) {
		applicationEntityService.startApplicationEntity(applicationEntityId);
	}
	@PutMapping("/application-entities/{applicationEntityId}/stop")
	public void stopApplicationEntity(@PathVariable int applicationEntityId) {
		applicationEntityService.stopApplicationEntity(applicationEntityId);
	}
}
