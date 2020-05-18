package com.almustkbal.pacs.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.almustkbal.pacs.domain.Role;
import com.almustkbal.pacs.domain.RoleName;

public interface RoleRepository extends JpaRepository<Role, Long> {

	Role findByName(RoleName roleName);
}
