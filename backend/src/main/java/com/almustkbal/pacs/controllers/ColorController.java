package com.almustkbal.pacs.controllers;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.MessageSource;
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

import com.almustkbal.pacs.domain.Color;
import com.almustkbal.pacs.services.ColorService;

@CrossOrigin(origins = "*")
@RestController
public class ColorController {
	@Autowired
	private ColorService colorService;
	
	@GetMapping("/colors")
	public Page<Color> retrieveAllColors(Pageable pageable) {
		return colorService.getColors(pageable);
	}

	@GetMapping("/colors/{colorId}")
	public Color retrieveColorById(@PathVariable long colorId) {
		return colorService.getColorById(colorId);
	}

	@DeleteMapping("/colors/{colorId}")
	public void deleteColor(@PathVariable long colorId) {
		colorService.deleteColor(colorId);
	}

	@PostMapping("/colors")
	public ResponseEntity<Color> createColor(@Valid @RequestBody Color color) {

		Color createdColor = colorService.createColor(color);
		return new ResponseEntity<Color>(createdColor, HttpStatus.OK);

	}

	@PutMapping("/colors/{colorId}")
	public ResponseEntity<Color> updateColor(@PathVariable int colorId, @Valid @RequestBody Color color) {
		Color updatedColor = colorService.updateColor(colorId, color);
		return new ResponseEntity<Color>(updatedColor, HttpStatus.OK);
	}
}
