/**
 * 
 */
package com.almustkbal.pacs.services.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.almustkbal.pacs.entities.Color;
import com.almustkbal.pacs.exceptions.ResourceNotFoundException;
import com.almustkbal.pacs.repositories.ColorRepository;
import com.almustkbal.pacs.services.ColorService;

/**
 * @author mohamedsalah
 *
 */
@Service
public class ColorServiceImpl implements ColorService {

	@Autowired
	private ColorRepository colorRepository;

	@Override
	public Page<Color> getColors(Pageable pageable) {
		return colorRepository.findAll(pageable);
	}

	@Override
	public Color getColorById(long id) {
		Optional<Color> color = colorRepository.findById(id);
		if (!color.isPresent()) {
			throw new ResourceNotFoundException("ColorId " + id + " not found");
		}
		return color.get();
	}

	@Override
	public Color createColor(Color color) {
		return colorRepository.save(color);
	}

	@Override
	public Color updateColor(long id, Color color) {
		Optional<Color> existingColor = colorRepository.findById(id);
		if (!existingColor.isPresent()) {
			throw new ResourceNotFoundException("ColorId " + id + " not found");
		}
		existingColor.get().setName(color.getName());
		return colorRepository.save(existingColor.get());
	}

	@Override
	public void deleteColor(long id) {
		if (!colorRepository.existsById(id)) {
			throw new ResourceNotFoundException("ColorId " + id + " not found");
		}
		colorRepository.deleteById(id);

	}

}
