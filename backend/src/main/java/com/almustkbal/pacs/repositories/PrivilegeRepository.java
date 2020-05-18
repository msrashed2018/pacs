package com.almustkbal.pacs.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.almustkbal.pacs.domain.Privilege;
import com.almustkbal.pacs.domain.PrivilegeName;

public interface PrivilegeRepository extends JpaRepository<Privilege, Long> {
	Privilege findByName(PrivilegeName privilegeName);
}
