package com.almustkbal.pacs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "GENERAL_TAG")
@Data
@Setter
@Getter
public class Tag {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "ID")
	private long pkTBLTagID;

	@Column(name = "DISPLAY_ORDER", nullable = false)
	@NotNull(message = "tagOrder must not be null")
	private int displayOrder;
	
	@Column(name = "TAG_NAME", nullable = false, unique = true)
	@NotNull(message = "tagName must not be null")
	private String tagName;
	
	@Column(name = "TAG_ID", nullable = false)
	@NotNull(message = "tagID must not be null")
	private String tagId;
	
//	@Column(name = "TAG_TYPE", nullable = false)
	@NotNull(message = "tagType must not be null")
	@Enumerated(EnumType.STRING)
	private TagType tagType;
	
	@Column(name = "REQUIRED", nullable = false)
	private boolean required;
	
}
