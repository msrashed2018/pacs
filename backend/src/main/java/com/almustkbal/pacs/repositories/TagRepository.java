package com.almustkbal.pacs.repositories;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import com.almustkbal.pacs.domain.Tag;

public interface TagRepository extends JpaRepository<Tag, Long> {

	List<Tag> findByRequired(boolean required, Sort ascending);

}
