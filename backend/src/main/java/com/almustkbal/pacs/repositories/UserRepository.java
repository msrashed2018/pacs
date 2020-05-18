package com.almustkbal.pacs.repositories;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.almustkbal.pacs.domain.RoleName;
import com.almustkbal.pacs.domain.User;

public interface UserRepository extends JpaRepository<User, Long> {

	@Query("SELECT u from User u where u.id=:userId")
	Optional<User> findById(Long userId);

	Optional<User> findByUsername(String username);

	User findByEmailIgnoreCase(String email);

//	@Query("SELECT Distinct u FROM User u " + "LEFT JOIN  u.roles role WHERE role.name IN (:roles) AND "
////			+ "  (u.email LIKE CONCAT('%',:searchKey,'%') OR u.mobile LIKE CONCAT('%',:searchKey,'%') OR u.firstname LIKE CONCAT('%',:searchKey,'%') OR u.lastname LIKE CONCAT('%',:searchKey,'%') OR u.username LIKE CONCAT('%',:searchKey,'%') )"
//			+ "  u.username LIKE CONCAT('%',:username,'%') " + "AND u.email LIKE CONCAT('%',:email,'%') "
//			+ " AND u.mobile LIKE CONCAT('%',:mobile,'%') "
//			+ " AND u.reportingManager LIKE CONCAT('%',:reportingManager,'%') "
//			+ " AND :enabled is null or  u.enabled = :enabled "
//			+ " AND CONCAT(u.firstname,' ', u.lastname )  LIKE CONCAT('%', :name, '%') "
//			+ " AND (:registeredDate is null or  CAST(u.registeredDate AS date) = CAST(:registeredDate AS date) )")
//	
//	

	@Query("SELECT Distinct u FROM User u " + "LEFT JOIN  u.roles role WHERE role.name IN (:roles) AND "
			+ "  (u.email LIKE CONCAT('%',:searchKey,'%') OR u.mobile LIKE CONCAT('%',:searchKey,'%') OR CONCAT(u.firstname,' ', u.lastname ) LIKE CONCAT('%',:searchKey,'%') OR u.username LIKE CONCAT('%',:searchKey,'%') )"
			+ " AND u.username LIKE CONCAT('%',:username,'%') "
			+ " AND u.email LIKE CONCAT('%',:email,'%')               "
			+ " AND u.mobile LIKE CONCAT('%',:mobile,'%')            "
			+ " AND (:enabled is null or  u.enabled = :enabled ) "
			+ " AND CONCAT(u.firstname,' ', u.lastname )  LIKE CONCAT('%', :name, '%')                          "
			+ " AND (:registeredDate is null or  CAST(u.registeredDate AS date) = CAST(:registeredDate AS date) )")
	Page<User> findUsers(List<RoleName> roles, String searchKey, String username, String email, String mobile,
			Boolean enabled, String name, Date registeredDate, Pageable pageable);

	List<User> findByUsernameOrEmailIgnoreCaseOrMobile(String username, String email, String mobile);

	Boolean existsByUsername(String username);

	Boolean existsByMobile(String mobile);

	Boolean existsByEmail(String email);

}
