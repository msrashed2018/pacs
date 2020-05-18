package com.almustkbal.pacs.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.almustkbal.pacs.domain.Series;

public interface SeriesRepository extends JpaRepository<Series, Long> {

	Series findBySeriesInstanceUIDAndSeriesNumber(String seriesInstanceUID, Integer seriesNumber);

	Series findByPkTBLSeriesID(Long pkTBLSeriesID);

}
