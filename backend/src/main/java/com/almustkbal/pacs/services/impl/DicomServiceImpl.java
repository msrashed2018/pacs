package com.almustkbal.pacs.services.impl;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.almustkbal.pacs.components.ActiveDicoms;
import com.almustkbal.pacs.dto.TagDTO;
import com.almustkbal.pacs.entities.Equipment;
import com.almustkbal.pacs.entities.Instance;
import com.almustkbal.pacs.entities.Patient;
import com.almustkbal.pacs.entities.Radiation;
import com.almustkbal.pacs.entities.Series;
import com.almustkbal.pacs.entities.Study;
import com.almustkbal.pacs.entities.Tag;
import com.almustkbal.pacs.entities.TagType;
import com.almustkbal.pacs.repositories.EquipmentRepository;
import com.almustkbal.pacs.repositories.InstanceRepository;
import com.almustkbal.pacs.repositories.PatientRepository;
import com.almustkbal.pacs.repositories.RadiationRepository;
import com.almustkbal.pacs.repositories.SeriesRepository;
import com.almustkbal.pacs.repositories.StudyRepository;
import com.almustkbal.pacs.repositories.TagRepository;
import com.almustkbal.pacs.server.DicomReader;
import com.almustkbal.pacs.services.DicomService;
import com.almustkbal.pacs.utils.DicomEntityBuilder;

@Service
public class DicomServiceImpl implements DicomService {
	@Autowired
	InstanceRepository instanceRepository;

	@Autowired
	SeriesRepository seriesRepository;

	@Autowired
	StudyRepository studyRepository;

	@Autowired
	PatientRepository patientRepository;

	@Autowired
	EquipmentRepository equipmentRepository;
	@Autowired
	TagRepository tagRepository;

	@Autowired
	RadiationRepository radiationRepository;

	@Autowired
	private ActiveDicoms activeDicoms;

	private static final Logger LOG = LoggerFactory.getLogger(DicomServiceImpl.class);

	public List<TagDTO> getDicomTags(DicomReader reader) {
		List<TagDTO> tags = new ArrayList<TagDTO>();

		List<Tag> requiredTags = tagRepository.findByRequired(true, Sort.by("displayOrder").ascending());

		for (Tag tag : requiredTags) {
			TagDTO tagDto = new TagDTO();
			tagDto.setTagName(tag.getTagName());
			if (tag.getTagType().equals(TagType.STRING)) {
				if (tag.getTagId().startsWith("0002")) {
					// if tag start with 0002 hex, it is related to file metadata info
					tagDto.setTagValue(reader.getMetaData().getString(Integer.parseInt(tag.getTagId(), 16)));
				} else {
					tagDto.setTagValue(reader.getDataSet().getString(Integer.parseInt(tag.getTagId(), 16)));
				}
			} else if (tag.getTagType().equals(TagType.DATE)) {
				DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");
				tagDto.setTagValue(dateFormat.format(reader.getDataSet().getDate(Long.parseLong(tag.getTagId(), 16))));
			} else if (tag.getTagType().equals(TagType.INTEGER)) {
				tagDto.setTagValue(String.valueOf(reader.getDataSet().getInt(Integer.parseInt(tag.getTagId(), 16), 0)));
			} else if (tag.getTagType().equals(TagType.FLOAT)) {
				tagDto.setTagValue(
						String.valueOf(reader.getDataSet().getFloat(Integer.parseInt(tag.getTagId(), 16), 0)));
			}
			tags.add(tagDto);
		}
		return tags;
	}

	@Transactional
	@Override
	public Patient buildEntities(DicomReader reader, boolean save) {
		try {
			LOG.info("\n\n\n building Entities \n\n\n");
			printStats(reader.getPatientName() + " " + reader.getPatientID() + " " + reader.getPatientAge() + " "
					+ reader.getPatientSex() + " Started");
			Patient patient = buildPatient(reader, save);
			activeDicoms.add(reader.getMediaStorageSopInstanceUID(), patient.toString());

			if (patient != null) {
				Study study = buildStudy(reader, patient, save);
				if (study != null) {
					Series series = buildSeries(reader, study, save);
					if (series != null) {
						Equipment equipment = buildEquipment(reader, series, save);// one2one relationship with series
						Instance instance = buildInstance(reader, series, save);
						if (save) {
							// update entity modification dates according to the instance creation
							series.setModifiedDate(instance.getCreatedDate());
							seriesRepository.save(series);

							equipment.setModifiedDate(instance.getCreatedDate());
							equipmentRepository.save(equipment);

							study.setModifiedDate(instance.getCreatedDate());
							studyRepository.save(study);

							patient.setModifiedDate(instance.getCreatedDate());
							patientRepository.save(patient);

							// try{ entityManager.getTransaction().commit(); } catch(Exception e){}

							patient = patientRepository.findByPkTBLPatientID(patient.getPkTBLPatientID());
							LOG.info("Dicom Instance saved successfully! {}", instance.toString());
						}
					}
				}
			}

			// LOG.info("Yes {} exists!", reader.getMediaStorageSopInstanceUID());
			activeDicoms.remove(reader.getMediaStorageSopInstanceUID());

			printStats(reader.getPatientName() + " " + reader.getPatientID() + " " + reader.getPatientAge() + " "
					+ reader.getPatientSex() + " Ended");
			LOG.info(
					"=================================================================================================================================\n\n\n");
			return patient;

		} catch (Exception e) {
			LOG.error(e.getMessage());
			throw new RuntimeException(e.getMessage());
		}

	}

	@Override
	@Transactional
	public Patient buildPatient(DicomReader reader, boolean save) {

		LOG.info("\n\n\n building Patient \n\n\n");
//		LOG.info("In process; Patient Name: {}, Patient ID: {}", reader.getPatientName(), reader.getPatientID());
		// check if patient exists
		Patient patient = patientRepository.findByPatientID(reader.getPatientID());
		if (patient == null) {// let's create new patient
			patient = DicomEntityBuilder.newPatient(reader.getPatientAge(), reader.getPatientBirthDay(),
					reader.getPatientID(), reader.getPatientName(), reader.getPatientSex());
			if (save) {
				patientRepository.save(patient);
				patient = patientRepository.findByPatientID(reader.getPatientID());
			}
		} else {
			// LOG.info("Patient already exists; Patient Name: {}, Patient ID: {} ",
			// reader.getPatientName(), reader.getPatientID());
		}

		return patient;
	}

	@Override
	@Transactional
	public Study buildStudy(DicomReader reader, Patient patient, boolean save) {
		LOG.info("\n\n\n building Study \n\n\n");
		// check if study exists
		Study study = studyRepository.findByStudyInstanceUID(reader.getStudyInstanceUID());
		if (study == null) {// let's create new study
			study = DicomEntityBuilder.newStudy(reader.getAccessionNumber(), reader.getAdditionalPatientHistory(),
					reader.getAdmittingDiagnosesDescription(), reader.getReferringPhysicianName(),
					reader.getStudyDateTime(), reader.getStudyID(), reader.getStudyDescription(),
					reader.getStudyInstanceUID(), reader.getStudyPriorityID(), reader.getStudyStatusID());
			study.setPatient(patient);
			if (save) {
				studyRepository.save(study);
				study = studyRepository.findByStudyInstanceUID(reader.getStudyInstanceUID());
			}
			Set<Study> studies = new HashSet();
			studies.add(study);
			patient.setStudies(studies);
		} else {
			LOG.info("Study already exists; Study Instance UID:  {}", study.getStudyInstanceUID());
		}

		return study;
	}

	@Override
	@Transactional
	public Series buildSeries(DicomReader reader, Study study, boolean save) {
		LOG.info("\n\n\n building Series \n\n\n");
		// check if series exists
		Series series = seriesRepository.findBySeriesInstanceUIDAndSeriesNumber(reader.getSeriesInstanceUID(),
				reader.getSeriesNumber());
		if (series == null) {// let's create new series
			series = DicomEntityBuilder.newSeries(reader.getBodyPartExamined(), reader.getLaterality(),
					reader.getOperatorsName(), reader.getPatientPosition(), reader.getProtocolName(),
					reader.getSeriesDateTime(), reader.getSeriesDescription(), reader.getSeriesInstanceUID(),
					reader.getSeriesNumber());
			series.setStudy(study);
			if (save) {
				seriesRepository.save(series);
				series = seriesRepository.findBySeriesInstanceUIDAndSeriesNumber(reader.getSeriesInstanceUID(),
						reader.getSeriesNumber());
			}
			Set<Series> serieses = new HashSet();
			serieses.add(series);
			study.setSerieses(serieses);
		} else {
			LOG.info("Series already exists; Series Instance UID: {}", series.getSeriesInstanceUID());
		}

		return series;
	}

	@Override
	@Transactional
	public Equipment buildEquipment(DicomReader reader, Series series, boolean save) {
		LOG.info("\n\n\n building Equipment\n\n\n");
		// check if equipment exists
		Equipment equipment = equipmentRepository.findBySeriesPkTBLSeriesID(series.getPkTBLSeriesID());
		if (equipment == null) {
			equipment = DicomEntityBuilder.newEquipment(reader.getConversionType(), reader.getDeviceSerialNumber(),
					reader.getInstitutionAddress(), reader.getInstitutionName(),
					reader.getInstitutionalDepartmentName(), reader.getManufacturer(),
					reader.getManufacturerModelName(), reader.getModality(), reader.getSoftwareVersion(),
					reader.getStationName());
			equipment.setSeries(series);// set the Series to Equipment because we now have the pkTBLSeriesID
			if (save) {
				equipmentRepository.save(equipment);
				equipment = equipmentRepository.findBySeriesPkTBLSeriesID(series.getPkTBLSeriesID());
			}
			series.setEquipment(equipment);

		} else {
			LOG.info("Equipment already exists; Equipment Primary ID {}", equipment.getPkTBLEquipmentID());
		}

		return equipment;
	}

	@Override
	@Transactional
	public Instance buildInstance(DicomReader reader, Series series, boolean save) {
		LOG.info("\n\n\n building Instance \n\n\n");
		// check first if instance exists
		Instance instance = instanceRepository.findBySopInstanceUID(reader.getSOPInstanceUID());
		if (instance == null) {// let's create new instance along with dependent objects
			instance = DicomEntityBuilder.newInstance(reader.getAcquisitionDateTime(), reader.getContentDateTime(),
					reader.getExposureTime(), reader.getImageOrientation(), reader.getImagePosition(),
					reader.getImageType(), reader.getInstanceNumber(), reader.getKvp(),
					reader.getMediaStorageSopInstanceUID(), reader.getPatientOrientation(), reader.getPixelSpacing(),
					reader.getSliceLocation(), reader.getSliceThickness(), reader.getSopClassUID(),
					reader.getSOPInstanceUID(), reader.getTransferSyntaxUID(), reader.getWindowCenter(),
					reader.getWindowWidth(), reader.getXrayTubeCurrent());
			instance.setSeries(series);

			Radiation radiation = DicomEntityBuilder.newRadiation(reader.getTotalTimeOfFluoroscopy(),
					reader.getTotalNumberOfExposures(), reader.getDistanceSourceToEntrance(), reader.getEntranceDose(),
					reader.getEntranceDoseDerivation(), reader.getExposedArea(), reader.getCommentsOnRadiationDose(),
					reader.getExposureDoseSequence(), reader.getRadiationMode(), reader.getXRayTubeCurrentInuA(),
					reader.getFilterMaterial(), reader.getXRayTubeCurrent(), reader.getDistanceSourceToDetector(),
					reader.getGridFocalDistance(), reader.getImageAndFluoroscopyAreaDoseProduct(),
					reader.getRadiopharmaceutical(), reader.getRadionuclideTotalDose(),
					reader.getRadionuclideHalfLife(), reader.getBodyPartThickness(), reader.getCompressionForce(),
					reader.getFilterType(), reader.getEntranceDoseInmGy(), reader.getHalfValueLayer(),
					reader.getCTDIvol());

			instance.setRadiation(radiationRepository.save(radiation));
			if (save) {
				instanceRepository.save(instance);
				instance = instanceRepository.findBySopInstanceUID(reader.getSOPInstanceUID());
			}
			Set<Instance> instances = new HashSet<Instance>();
			instances.add(instance);
			series.setInstances(instances);
		} else {
			LOG.info("Instance already exists; SOP Instance UID {}, Instance Number {}", instance.getInstanceNumber(),
					instance.getInstanceNumber());
		}

		return instance;
	}

	public void printStats(String status) {
		// String str = Thread.currentThread().getName().split("@@")[0];
		// Thread.currentThread().setName(String.valueOf(Thread.currentThread().getId()));
		LOG.info("{} {} {} [Active Threads: {}] ", Thread.currentThread().getId(), Thread.currentThread().getName(),
				status, Thread.activeCount());

	}

	@Override
	public Page<Patient> getPatients(String patientName, String gender, String patientId, String instituitionName,
			String physician, List<String> modalities, Date dateFrom, Date dateTo, Pageable pageable) {

		return patientRepository
				.findByPatientNameAndGenderAndPatientIdAndInstituitionNameAndPhysicianAndModalityAndDateBetween(
						patientName, gender, patientId, instituitionName, physician, modalities, dateFrom, dateTo,
						pageable);
	}

	@Override
	@Transactional
	public void deletePatient(Long pkTBLPatientID) {
		patientRepository.deleteByPkTBLPatientID(pkTBLPatientID);
	}
}
