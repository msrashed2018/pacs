package com.almustkbal.pacs.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "COLOR")
@Data
@Setter
@Getter
public class Color {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "COLOR_ID")
	private long id;

	@Column(name = "NAME", nullable = false, unique = true)
	@NotNull(message = "color name must not be null")
	private String name;

}
