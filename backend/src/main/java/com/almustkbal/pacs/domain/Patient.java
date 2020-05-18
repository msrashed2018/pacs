package com.almustkbal.pacs.domain;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
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
 * Entity implementation class for Entity: Patient
 * 
 */
@Entity
@Table(name = "PATIENT")
@JsonIdentityInfo(generator=ObjectIdGenerators.IntSequenceGenerator.class, property="@pkTBLPatientID")
//@Data
@Setter
@Getter
public class Patient implements Serializable {

	private static final long serialVersionUID = 657390142518153080L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)	
	@Column(name="pkTBLPatientID")	
	private Long pkTBLPatientID;
	
	@Column(name="patientID", length=100)
	private String patientID;	
	
	@Column(name="patientName", length=100)
	private String patientName;
	
	@Column(name="patientSex", length=10)
	private String patientSex;
	
	@Temporal(TemporalType.DATE)
	@Column(name="patientBirthday")
	private Date patientBirthday;
	
	@Column(name="patientAge", length=10)
	private String patientAge;
	
	@Temporal(TemporalType.TIMESTAMP)
    @Column(name="createdDate", updatable = false, insertable=true)
	private Date createdDate;
	
	@Temporal(TemporalType.TIMESTAMP)
    @Column(name="modifiedDate", insertable = true, updatable=true)
	private Date modifiedDate;

	@OneToMany(mappedBy = "patient", fetch=FetchType.EAGER)
//	@JsonIgnore
	private Set<Study> studies;

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
				"Patient[pkTBLPatientID=%d, patientID=%s, patientName=%s, patientSex=%s, patientBirthday=%s, patientAge=%s, createdDate=%s, modifiedDate=%s]", 
				pkTBLPatientID, patientID, patientName, patientSex, patientBirthday, patientAge, createdDate, modifiedDate);
	}
	
}
