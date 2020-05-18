package com.almustkbal.pacs.domain;

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
 * Entity implementation class for Entity: Series
 *
 */
@Entity
@Table(name="SERIES")
@JsonIdentityInfo(generator=ObjectIdGenerators.IntSequenceGenerator.class, property="@pkTBLSeriesID")
//@Data
@Setter
@Getter
public class Series implements Serializable {

	private static final long serialVersionUID = 6918147797908911998L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="pkTBLSeriesID")
	private Long pkTBLSeriesID;
	
	@Column(name="seriesInstanceUID", length=100)
	private String seriesInstanceUID;
	
	@Column(name="seriesNumber")
	private Integer seriesNumber;
	
	@Column(name="seriesDescription", length=100)
	private String seriesDescription;	
		
	@Column(name="bodyPartExamined", length=40)
	private String bodyPartExamined;
	
	@Column(name="patientPosition", length=30)	
	private String patientPosition;
	
	@Column(name="laterality", length=100)
	private String laterality;
	
	@Column(name="protocolName", length=100)
	private String protocolName;
	
	@Column(name="operatorsName", length=50)
	private String operatorsName;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="seriesDateTime")
	private Date seriesDateTime;
	
	@Temporal(TemporalType.TIMESTAMP)
    @Column(name="createdDate", updatable = false, insertable=true)
	private Date createdDate;
	
	@Temporal(TemporalType.TIMESTAMP)
    @Column(name="modifiedDate", insertable = true, updatable=true)
	private Date modifiedDate;
		
	@ManyToOne(cascade = {CascadeType.ALL})
	@JoinColumn(name="pkTBLStudyID")
	private Study study;

	@OneToOne(mappedBy = "series")
	private Equipment equipment;

	@OneToMany(mappedBy = "series", fetch = FetchType.EAGER)
	private Set<Instance> instances;	

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
				"Series[pkTBLSeriesID=%d, seriesInstanceUID=%s, seriesNumber=%d, seriesDescription=%s, bodyPartExamined=%s, patientPosition=%s, laterality=%s, protocolName=%s, operatorsName=%s, seriesDateTime=%s, createdDate=%s, modifiedDate=%s]", 
				pkTBLSeriesID, seriesInstanceUID, seriesNumber, seriesDescription, bodyPartExamined, patientPosition, laterality, protocolName, operatorsName, seriesDateTime, createdDate, modifiedDate);
	}
   
}
