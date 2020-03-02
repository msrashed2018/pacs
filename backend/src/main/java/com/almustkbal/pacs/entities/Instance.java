package com.almustkbal.pacs.entities;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import lombok.Getter;
import lombok.Setter;

/**
 * Entity implementation class for Entity: instance
 *
 */
@Entity
@Table(name="INSTANCE")
@JsonIdentityInfo(generator=ObjectIdGenerators.IntSequenceGenerator.class, property="@pkTBLSeriesID")
//@Data
@Setter
@Getter
public class Instance implements Serializable {

	private static final long serialVersionUID = -4366785097270784782L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="pkTBLInstanceID")
	private Long pkTBLInstanceID;
	
	@Column(name="sopInstanceUID", length=100)
	private String sopInstanceUID;
	
	@Column(name="sopClassUID", length=100)
	private String sopClassUID;
	
	@Column(name="instanceNumber")
	private Integer instanceNumber;
	
	@Column(name="patientOrientation", length=40)
	private String patientOrientation;
	
	@Column(name="mediaStorageSopInstanceUID", length=100)
	private String mediaStorageSopInstanceUID;
	
	@Column(name="transferSyntaxUID", length=100)
	private String transferSyntaxUID;	

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="acquisitionDateTime")
	private Date acquisitionDateTime;
	
	@Column(name="imageType", length=40)
	private String imageType;
	
	@Column(name="pixelSpacing")
	private Float pixelSpacing;
	
	@Column(name="imageOrientation", length=40)
	private String imageOrientation;
	
	@Column(name="imagePosition", length=80)
	private String imagePosition;
	
	@Column(name="sliceThickness")
	private Float sliceThickness;
	
	@Column(name="sliceLocation")
	private Float sliceLocation;
	
	@Column(name="windowCenter", length=40)
	private String windowCenter;
	
	@Column(name="windowWidth", length=40)
	private String windowWidth;
	
	@Column(name="xrayTubeCurrent")
	private Integer xrayTubeCurrent;
	
	@Column(name="exposureTime")
	private Integer exposureTime;
	
	@Column(name="kvp", length=40)
	private String kvp;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="contentDateTime")
	private Date contentDateTime;
	
	@Temporal(TemporalType.TIMESTAMP)
    @Column(name="createdDate", updatable = false, insertable=true)
	private Date createdDate;
	
	@Temporal(TemporalType.TIMESTAMP)
    @Column(name="modifiedDate", insertable = true, updatable=true)
	private Date modifiedDate;

	@ManyToOne(cascade = {CascadeType.ALL})
	@JoinColumn(name="pkTBLSeriesID")
	private Series series;
	
	@OneToOne(mappedBy = "instance")
	private Radiation radiation;
	
	@PreUpdate
    @PrePersist
    public void updateTimeStamps() {    	
    	modifiedDate = new Date();
        if (createdDate==null) {
        	createdDate = new Date();
        }
    }
	
	@Override
	public String toString(){
		return String.format(
				"Instance[pkTBLInstanceID=%d, sopInstanceUID=%s, sopClassUID=%s, instanceNumber=%d, patientOrientation=%s, mediaStorageSopInstanceUID=%s, acquisitionDateTime=%s, imageType=%s, pixelSpacing=%f, imageOrientation=%s, imagePosition=%s, sliceThickness=%f, sliceLocation=%f, windowCenter=%s, windowWidth=%s, xrayTubeCurrent=%d, exposureTime=%d, kvp=%s, contentDateTime=%s, createdDate=%s, modifiedDate=%s]", 
				pkTBLInstanceID, sopInstanceUID, sopClassUID, instanceNumber, patientOrientation, mediaStorageSopInstanceUID, acquisitionDateTime, imageType, pixelSpacing, imageOrientation, imagePosition, sliceThickness, sliceLocation, windowCenter, windowWidth, xrayTubeCurrent, exposureTime, kvp, contentDateTime, createdDate, modifiedDate);
	}
   
}
