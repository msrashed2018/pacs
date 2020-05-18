package com.almustkbal.pacs.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.almustkbal.pacs.domain.Instance;

public interface InstanceRepository extends JpaRepository<Instance, Long> {

	Instance findBySopInstanceUID(String sopInstanceUID);

	Instance findByPkTBLInstanceID(Long pkTBLInstanceID);

}
