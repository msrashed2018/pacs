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
import javax.persistence.OneToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity implementation class for Entity: Equipment
 *
 */
@Entity
@Table(name="EQUIPMENT")
@JsonIdentityInfo(generator=ObjectIdGenerators.IntSequenceGenerator.class, property="@pkTBLEquipmentID")
@Data
@Setter
@Getter
public class Equipment implements Serializable {

	private static final long serialVersionUID = 6245262777427705812L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)	
	@Column(name="pkTBLEquipmentID")
	private Long pkTBLEquipmentID;
	
	@Column(name="modality", length=50)
	private String modality = "";
	
	@Column(name="conversionType", length=50)
	private String conversionType = "";
	
	@Column(name="stationName", length=60)
	private String stationName = "";
	
	@Column(name="institutionName", length=100)
	private String institutionName = "";
	
	@Column(name="institutionAddress", length=150)
	private String institutionAddress = "";
	
	@Column(name="institutionalDepartmentName", length=50)
	private String institutionalDepartmentName = "";
	
	@Column(name="manufacturer", length=100)
	private String manufacturer = "";
	
	@Column(name="manufacturerModelName", length=100)
	private String manufacturerModelName = "";
	
	@Column(name="softwareVersion", length=100)
	private String softwareVersion = "";
	
	@Column(name="deviceSerialNumber", length=100)
	private String deviceSerialNumber = "";
	
	@Temporal(TemporalType.TIMESTAMP)
    @Column(name="createdDate", updatable = false, insertable=true)
	private Date createdDate;
	
	@Temporal(TemporalType.TIMESTAMP)
    @Column(name="modifiedDate", insertable = true, updatable=true)
	private Date modifiedDate;
	
	
	@OneToOne(cascade = {CascadeType.ALL})
	@JoinColumn(name="pkTBLSeriesID")
	private Series series;
	
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
				"Equipment[pkTBLEquipmentID=%d, modality=%s, conversionType=%s, stationName=%s, institutionName=%s, institutionAddress=%s, institutionalDepartmentName=%s, manufacturer=%s, manufacturerModelName=%s, softwareVersion=%s, deviceSerialNumber=%s, createdDate=%s, modifiedDate=%s]", 
				pkTBLEquipmentID, modality, conversionType, stationName, institutionName, institutionAddress, institutionalDepartmentName, manufacturer, manufacturerModelName, softwareVersion, deviceSerialNumber, createdDate, modifiedDate);
	}
   
}
