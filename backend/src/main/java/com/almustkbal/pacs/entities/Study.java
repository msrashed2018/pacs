package com.almustkbal.pacs.entities;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
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
 * Entity implementation class for Entity: Study
 *
 */
@Entity
@Table(name="STUDY")
@JsonIdentityInfo(generator=ObjectIdGenerators.IntSequenceGenerator.class, property="@pkTBLStudyID")
//@Data
@Setter
@Getter
public class Study implements Serializable {

	private static final long serialVersionUID = 6126899965207417288L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="pkTBLStudyID")
	private Long pkTBLStudyID;	

	@Column(name="studyID", length=50)
	private String studyID;
	
	@Column(name="studyDescription", length=300)
	private String studyDescription;
	
	@Column(name="studyInstanceUID", length=100)
	private String studyInstanceUID;
	
	@Column(name="accessionNumber", length=30)
	private String accessionNumber;	
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="studyDateTime")
	private Date studyDateTime;
	
	@Column(name="referringPhysicianName", length=100)
	private String referringPhysicianName;
	
	@Column(name="additionalPatientHistory", length=300)
	private String additionalPatientHistory;
	
	@Column(name="admittingDiagnosesDescription", length=200)
	private String admittingDiagnosesDescription;
	
	@Column(name="studyStatusID", length=40)
	private String studyStatusID;
	
	@Column(name="studyPriorityID", length=40)
	private String studyPriorityID;
	
	@Temporal(TemporalType.TIMESTAMP)
    @Column(name="createdDate", updatable = false, insertable=true)
	private Date createdDate;
	
	@Temporal(TemporalType.TIMESTAMP)
    @Column(name="modifiedDate", insertable = true, updatable=true)
	private Date modifiedDate;

	@ManyToOne(cascade = {CascadeType.ALL})
	@JoinColumn(name="pkTBLPatientID")
	private Patient patient; 
	
	@OneToMany(mappedBy = "study", fetch = FetchType.EAGER)
	private Set<Series> serieses;	
	
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
				"Study[pkTBLStudyID=%d, studyID=%s, studyDescription=%s, studyInstanceUID=%s, accessionNumber=%s, studyDateTime=%s, referringPhysicianName=%s, additionalPatientHistory=%s, admittingDiagnosesDescription=%s, studyStatusID=%s, studyPriorityID=%s, createdDate=%s, modifiedDate=%s, pkTBLPatientID=%s]", 
				pkTBLStudyID, studyID, studyDescription, studyInstanceUID, accessionNumber, studyDateTime, referringPhysicianName, additionalPatientHistory, admittingDiagnosesDescription, studyStatusID, studyPriorityID, createdDate, modifiedDate, patient.getPkTBLPatientID());
	}
	
   
}
