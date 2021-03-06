package com.almustkbal.pacs.repositories;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.almustkbal.pacs.domain.PasswordResetToken;
import com.almustkbal.pacs.domain.User;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
	PasswordResetToken findByToken(String token);

	Boolean existsByUser(User user);

	int deleteByUserId(Long userId);

	List<PasswordResetToken> findAllByExpiryDateLessThan(Date date);

	void deleteByExpiryDateLessThan(Date date);

	@Modifying
	@Query("delete from PasswordResetToken t where t.expiryDate <= ?1")
	void deleteAllExpiredSince(Date now);
}
