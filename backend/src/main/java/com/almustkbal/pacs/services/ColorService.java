package com.almustkbal.pacs.services;

import org.springframework.data.domain.Pageable;

import com.almustkbal.pacs.entities.Color;

import org.springframework.data.domain.Page;

public interface ColorService {
	
	Page<Color> getColors(Pageable pageable);
	
	Color getColorById(long id);
	
	Color createColor(Color color);
	
	Color updateColor(long id, Color color);
	
	void deleteColor(long id);
}
