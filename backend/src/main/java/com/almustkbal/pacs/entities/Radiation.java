package com.almustkbal.pacs.entities;

import java.io.Serializable;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "RADIATION")
@JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class, property = "@pkTBLRadiationID")
//@Data
@Setter
@Getter
public class Radiation implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "pkTBLRadiationID")
	private Long pkTBLRadiationID;

	@Column(name = "anatomicStructure")
	private String anatomicStructure;

	@Column(name = "totalTimeOfFluoroscopy")
	private String totalTimeOfFluoroscopy;

	@Column(name = "totalNumberOfExposures")
	private String totalNumberOfExposures;

	@Column(name = "distanceSourceToEntrance")
	private String distanceSourceToEntrance;

	@Column(name = "entranceDose")
	private String entranceDose;

	@Column(name = "entranceDoseDerivation")
	private String entranceDoseDerivation;

	@Column(name = "exposedArea")
	private String exposedArea;

	@Column(name = "commentsOnRadiationDose")
	private String commentsOnRadiationDose;

	@Column(name = "exposureDoseSequence")
	private String exposureDoseSequence;

	@Column(name = "radiationMode")
	private String radiationMode;

	@Column(name = "xRayTubeCurrentInuA")
	private String xRayTubeCurrentInuA;

	@Column(name = "filterMaterial")
	private String filterMaterial;

	@Column(name = "xRayTubeCurrent")
	private Integer xRayTubeCurrent;

	@Column(name = "distanceSourceToDetector")
	private String distanceSourceToDetector;

	@Column(name = "gridFocalDistance")
	private String gridFocalDistance;

	@Column(name = "imageAndFluoroscopyAreaDoseProduct")
	private String imageAndFluoroscopyAreaDoseProduct;

	@Column(name = "radiopharmaceutical")
	private String radiopharmaceutical;

	@Column(name = "radionuclideTotalDose")
	private String radionuclideTotalDose;

	@Column(name = "radionuclideHalfLife")
	private String radionuclideHalfLife;

	@Column(name = "bodyPartThickness")
	private String bodyPartThickness;

	@Column(name = "compressionForce")
	private String compressionForce;

	@Column(name = "filterType")
	private String filterType;

	@Column(name = "entranceDoseInmGy")
	private String entranceDoseInmGy;

	@Column(name = "halfValueLayer")
	private String halfValueLayer;

	@Column(name = "cTDIvol")
	private Double cTDIvol;

	@OneToOne(cascade = {CascadeType.ALL})
	@JoinColumn(name="pkTBLInstanceID")
	private Instance instance;
}
