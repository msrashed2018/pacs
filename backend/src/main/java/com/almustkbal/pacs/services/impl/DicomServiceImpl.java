package com.almustkbal.pacs.services.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.dcm4che3.tool.dcm2jpg.Dcm2Jpg;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.almustkbal.pacs.components.ActiveDicoms;
import com.almustkbal.pacs.dicom.commands.DicomFilter;
import com.almustkbal.pacs.domain.Equipment;
import com.almustkbal.pacs.domain.Instance;
import com.almustkbal.pacs.domain.Patient;
import com.almustkbal.pacs.domain.Radiation;
import com.almustkbal.pacs.domain.Series;
import com.almustkbal.pacs.domain.Study;
import com.almustkbal.pacs.exceptions.ResourceNotFoundException;
import com.almustkbal.pacs.model.ModalityName;
import com.almustkbal.pacs.repositories.EquipmentRepository;
import com.almustkbal.pacs.repositories.InstanceRepository;
import com.almustkbal.pacs.repositories.PatientRepository;
import com.almustkbal.pacs.repositories.RadiationRepository;
import com.almustkbal.pacs.repositories.SeriesRepository;
import com.almustkbal.pacs.repositories.StudyRepository;
import com.almustkbal.pacs.repositories.TagRepository;
import com.almustkbal.pacs.server.DicomReader;
import com.almustkbal.pacs.services.DicomService;
import com.almustkbal.pacs.services.FileStorageService;
import com.almustkbal.pacs.utils.DicomEntityBuilder;
import com.google.common.io.Files;

@Service
public class DicomServiceImpl implements DicomService {
	private static final String JPG_EXT = ".jpg";
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
	FileStorageService fileStorageService;

	@Autowired
	private ActiveDicoms activeDicoms;

	private static final Logger LOG = LoggerFactory.getLogger(DicomServiceImpl.class);

//	public List<TagDTO> getDicomTags(DicomReader reader) {
//		List<TagDTO> tags = new ArrayList<TagDTO>();
//
//		List<Tag> requiredTags = tagRepository.findByRequired(true, Sort.by("displayOrder").ascending());
//
//		for (Tag tag : requiredTags) {
//			TagDTO tagDto = new TagDTO();
//			tagDto.setTagName(tag.getTagName());
//			if (tag.getTagType().equals(TagType.STRING)) {
//				if (tag.getTagId().startsWith("0002")) {
//					// if tag start with 0002 hex, it is related to file metadata info
//					tagDto.setTagValue(reader.getMetaData().getString(Integer.parseInt(tag.getTagId(), 16)));
//				} else {
//					tagDto.setTagValue(reader.getDataSet().getString(Integer.parseInt(tag.getTagId(), 16)));
//				}
//			} else if (tag.getTagType().equals(TagType.DATE)) {
//				DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");
//				tagDto.setTagValue(dateFormat.format(reader.getDataSet().getDate(Long.parseLong(tag.getTagId(), 16))));
//			} else if (tag.getTagType().equals(TagType.INTEGER)) {
//				tagDto.setTagValue(String.valueOf(reader.getDataSet().getInt(Integer.parseInt(tag.getTagId(), 16), 0)));
//			} else if (tag.getTagType().equals(TagType.FLOAT)) {
//				tagDto.setTagValue(
//						String.valueOf(reader.getDataSet().getFloat(Integer.parseInt(tag.getTagId(), 16), 0)));
//			}
//			tags.add(tagDto);
//		}
//		return tags;
//	}

	@Override
	public Patient buildEntities(File dicomFile) throws IOException {
		DicomReader reader;
		reader = new DicomReader(dicomFile);
		Radiation radiation = DicomEntityBuilder.newRadiation(reader.getTotalTimeOfFluoroscopy(),
				reader.getTotalNumberOfExposures(), reader.getDistanceSourceToEntrance(), reader.getEntranceDose(),
				reader.getEntranceDoseDerivation(), reader.getExposedArea(), reader.getCommentsOnRadiationDose(),
				reader.getExposureDoseSequence(), reader.getRadiationMode(), reader.getXRayTubeCurrentInuA(),
				reader.getFilterMaterial(), reader.getXRayTubeCurrent(), reader.getDistanceSourceToDetector(),
				reader.getGridFocalDistance(), reader.getImageAndFluoroscopyAreaDoseProduct(),
				reader.getRadiopharmaceutical(), reader.getRadionuclideTotalDose(), reader.getRadionuclideHalfLife(),
				reader.getBodyPartThickness(), reader.getCompressionForce(), reader.getFilterType(),
				reader.getEntranceDoseInmGy(), reader.getHalfValueLayer(), reader.getCTDIvol());

		Equipment equipment = DicomEntityBuilder.newEquipment(reader.getConversionType(),
				reader.getDeviceSerialNumber(), reader.getInstitutionAddress(), reader.getInstitutionName(),
				reader.getInstitutionalDepartmentName(), reader.getManufacturer(), reader.getManufacturerModelName(),
				reader.getModality(), reader.getSoftwareVersion(), reader.getStationName());
		Set<Instance> instances = new HashSet<Instance>();
		Instance instance = DicomEntityBuilder.newInstance(reader.getAcquisitionDateTime(), reader.getContentDateTime(),
				reader.getExposureTime(), reader.getImageOrientation(), reader.getImagePosition(),
				reader.getImageType(), reader.getInstanceNumber(), reader.getKvp(),
				reader.getMediaStorageSopInstanceUID(), reader.getPatientOrientation(), reader.getPixelSpacing(),
				reader.getSliceLocation(), reader.getSliceThickness(), reader.getSopClassUID(),
				reader.getSOPInstanceUID(), reader.getTransferSyntaxUID(), reader.getWindowCenter(),
				reader.getWindowWidth(), reader.getXrayTubeCurrent());

		instance.setRadiation(radiation);
		instances.add(instance);
		instance.setImage(getImage(dicomFile));
		Set<Series> serieses = new HashSet<Series>();
		Series series = DicomEntityBuilder.newSeries(reader.getBodyPartExamined(), reader.getLaterality(),
				reader.getOperatorsName(), reader.getPatientPosition(), reader.getProtocolName(),
				reader.getSeriesDateTime(), reader.getSeriesDescription(), reader.getSeriesInstanceUID(),
				reader.getSeriesNumber());
		series.setEquipment(equipment);
		series.setInstances(instances);
		serieses.add(series);

		Study study = DicomEntityBuilder.newStudy(reader.getAccessionNumber(), reader.getAdditionalPatientHistory(),
				reader.getAdmittingDiagnosesDescription(), reader.getReferringPhysicianName(),
				reader.getStudyDateTime(), reader.getStudyID(), reader.getStudyDescription(),
				reader.getStudyInstanceUID(), reader.getStudyPriorityID(), reader.getStudyStatusID());
		study.setSerieses(serieses);

		Patient patient = DicomEntityBuilder.newPatient(reader.getPatientAge(), reader.getPatientBirthDay(),
				reader.getPatientID(), reader.getPatientName(), reader.getPatientSex());

		Set<Study> studies = new HashSet<Study>();
		studies.add(study);
		patient.setStudies(studies);
		return patient;

	}

	@Transactional
	@Override
	public Patient buildAndSaveEntities(File dicomFile) {
		try {
			DicomReader reader = new DicomReader(dicomFile);
			LOG.info("Active Dicoms:{} Received Patient Name:{} ID:{} Age:{} Sex:{} ", activeDicoms.toString(),
					reader.getPatientName(), reader.getPatientID(), reader.getPatientAge(), reader.getPatientSex());
			Patient patient = buildPatient(reader);
			activeDicoms.add(reader.getMediaStorageSopInstanceUID(), patient.toString());

			if (patient != null) {
				Study study = buildStudy(reader, patient);
				if (study != null) {
					Series series = buildSeries(reader, study);
					if (series != null) {

						Equipment equipment = buildEquipment(reader, series);// one2one relationship with series
						Instance instance = buildInstance(reader, series);

						String dicomFilePath = dicomFile.getParentFile().getPath().concat("/")
								.concat(instance.getSopInstanceUID()).concat(".dcm");

						File dicomFileRenamed = new File(dicomFilePath);
						Files.move(dicomFile, dicomFileRenamed);

						instance.setDicomFilePath(dicomFilePath);

						instanceRepository.save(instance);
						// getting image--- just for preview
//						instance.setImage(getImage(dicomFileRenamed));
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

//						patient = patientRepository.findByPkTBLPatientID(patient.getPkTBLPatientID());
						LOG.info("Dicom Instance saved successfully! {}", instance.toString());
					}
				}
			}

			// LOG.info("Yes {} exists!", reader.getMediaStorageSopInstanceUID());
			activeDicoms.remove(reader.getMediaStorageSopInstanceUID());

			printStats(reader.getPatientName() + " " + reader.getPatientID() + " " + reader.getPatientAge() + " "
					+ reader.getPatientSex() + " Ended");
			return patient;

		} catch (Exception e) {
			LOG.error(e.getMessage());
			throw new RuntimeException(e.getMessage());
		}

	}

	@Transactional
	public Patient buildPatient(DicomReader reader) {

//		LOG.info("In process; Patient Name: {}, Patient ID: {}", reader.getPatientName(), reader.getPatientID());
		// check if patient exists
		Patient patient = patientRepository.findByPatientID(reader.getPatientID());
		if (patient == null) {// let's create new patient
			patient = DicomEntityBuilder.newPatient(reader.getPatientAge(), reader.getPatientBirthDay(),
					reader.getPatientID(), reader.getPatientName(), reader.getPatientSex());
			patientRepository.save(patient);
			patient = patientRepository.findByPatientID(reader.getPatientID());
		} else {
			LOG.info("Patient already exists; Patient Name: {}, Patient ID: {} ", reader.getPatientName(),
					reader.getPatientID());
		}

		return patient;
	}

	@Transactional
	public Study buildStudy(DicomReader reader, Patient patient) {
		// check if study exists
		Study study = studyRepository.findByStudyInstanceUID(reader.getStudyInstanceUID());

		if (study == null) {// let's create new study
			study = DicomEntityBuilder.newStudy(reader.getAccessionNumber(), reader.getAdditionalPatientHistory(),
					reader.getAdmittingDiagnosesDescription(), reader.getReferringPhysicianName(),
					reader.getStudyDateTime(), reader.getStudyID(), reader.getStudyDescription(),
					reader.getStudyInstanceUID(), reader.getStudyPriorityID(), reader.getStudyStatusID());
			study.setPatient(patient);
			studyRepository.save(study);
			study = studyRepository.findByStudyInstanceUID(reader.getStudyInstanceUID());
			Set<Study> studies = new HashSet<Study>();
			studies.add(study);
			patient.setStudies(studies);
		} else {
			LOG.info("Study already exists; Study Instance UID:  {}", study.getStudyInstanceUID());
		}

		return study;
	}

	@Transactional
	public Series buildSeries(DicomReader reader, Study study) {
		// check if series exists
		Series series = seriesRepository.findBySeriesInstanceUIDAndSeriesNumber(reader.getSeriesInstanceUID(),
				reader.getSeriesNumber());
		if (series == null) {// let's create new series
			series = DicomEntityBuilder.newSeries(reader.getBodyPartExamined(), reader.getLaterality(),
					reader.getOperatorsName(), reader.getPatientPosition(), reader.getProtocolName(),
					reader.getSeriesDateTime(), reader.getSeriesDescription(), reader.getSeriesInstanceUID(),
					reader.getSeriesNumber());
			series.setStudy(study);
			seriesRepository.save(series);
			series = seriesRepository.findBySeriesInstanceUIDAndSeriesNumber(reader.getSeriesInstanceUID(),
					reader.getSeriesNumber());
			Set<Series> serieses = new HashSet<Series>();
			serieses.add(series);
			study.setSerieses(serieses);
		} else {
			LOG.info("Series already exists; Series Instance UID: {}", series.getSeriesInstanceUID());
		}

		return series;
	}

	@Transactional
	public Equipment buildEquipment(DicomReader reader, Series series) {
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
			equipmentRepository.save(equipment);
			equipment = equipmentRepository.findBySeriesPkTBLSeriesID(series.getPkTBLSeriesID());
			series.setEquipment(equipment);

		} else {
			LOG.info("Equipment already exists; Equipment Primary ID {}", equipment.getPkTBLEquipmentID());
		}

		return equipment;
	}

	@Transactional
	public Instance buildInstance(DicomReader reader, Series series) {
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
			instanceRepository.save(instance);
			instance = instanceRepository.findBySopInstanceUID(reader.getSOPInstanceUID());
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
//		 String str = Thread.currentThread().getName().split("@@")[0];
//		 Thread.currentThread().setName(String.valueOf(Thread.currentThread().getId()));
		LOG.info("{} {} {} [Active Threads: {}] ", Thread.currentThread().getId(), Thread.currentThread().getName(),
				status, Thread.activeCount());

	}

	@Override
	public Page<Patient> getPatients(DicomFilter dicomFilter, Pageable pageable) {

		if (dicomFilter.getModality().size() == 0) {
			List<String> modalities = new ArrayList<String>();
			modalities.add(ModalityName.CT.toString());
			modalities.add(ModalityName.MG.toString());
			modalities.add(ModalityName.PT.toString());
			modalities.add(ModalityName.PET.toString());
			modalities.add(ModalityName.DX.toString());
			modalities.add(ModalityName.DF.toString());
			dicomFilter.setModality(modalities);

		}

		return patientRepository.findPatients(dicomFilter.getPatientName(), dicomFilter.getGender(),
				dicomFilter.getPatientId(), dicomFilter.getInstituitionName(), dicomFilter.getPhysician(),
				dicomFilter.getModality(), dicomFilter.getFromDate(), dicomFilter.getToDate(), pageable);

	}

	@Override
	@Transactional
	public void deletePatient(String patientID) {

		Patient patient = patientRepository.findByPatientID(patientID);

		patientRepository.deleteByPatientID(patientID);

		Set<Study> studies = patient.getStudies();
		for (Study study : studies) {
			Set<Series> serieses = study.getSerieses();
			for (Series series : serieses) {
				Set<Instance> instances = series.getInstances();
				for (Instance instance : instances) {
					fileStorageService.deleteFile(instance.getDicomFilePath());
				}
			}
		}

	}

	private byte[] getImage(File dicomFile) {

		// TEMP IMAGE FILE CREATION
		File tempImage = null;
		Dcm2Jpg dcm2Jpg = null;
		byte[] bytes = null;
		try {
			dcm2Jpg = new Dcm2Jpg();// Dcm2Jpg isn't thread safe (due to ImageIO), so need to create a new instance
									// each thread...
			dcm2Jpg.initImageWriter("JPEG", "jpeg", null, null, null); // default JPEG writer class,
																		// compressionType, and quality
			String newfilename = FilenameUtils.removeExtension(dicomFile.getName()) + JPG_EXT; // remove the .dcm
																								// and assign a JPG
																								// extension
			tempImage = new File("D:/almostkbal" + "/" + newfilename);// create the temporary image
																		// file

			dcm2Jpg.convert(dicomFile, tempImage);// save the new jpeg into the .img temp folder
//			if (!tempImage.exists()) {
//				throw new Exception("error while creating tmp image"); // if not exists, throw exception to log and
//																		// return back
//			}

			// END OF TEMP FILE CREATION

			if (tempImage != null) {
				try {
					bytes = IOUtils.toByteArray(new FileInputStream(tempImage));
				} catch (IOException e) {
					LOG.error("failed convert image to byte array ... Exception: {}", e.getMessage(), e);
				}
			}

		} catch (Exception e) {
			LOG.error("failed convert {} to jpeg... Exception: {}", dicomFile, e.getMessage()); // shouldn't care...
		} finally {
			tempImage.delete();
		}

		return bytes;
	}

	@Override
	@Transactional
	public void mergePatient(String patientId, List<String> patientIds) {

		Patient firstPatient = patientRepository.findByPatientID(patientId);

		if (firstPatient == null) {
			throw new ResourceNotFoundException("First Patient ID-" + patientId + " not found");
		}
		List<Patient> mergedPatients = patientRepository.findByPatientIDIn(patientIds);

		if (mergedPatients.isEmpty()) {
			throw new ResourceNotFoundException("MergedPatients are not found");
		}

		for (Patient mergedPatient : mergedPatients) {
			for (Study study : mergedPatient.getStudies()) {
				study.setPatient(firstPatient);
				studyRepository.save(study);
			}
		}

	}

}
