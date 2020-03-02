package com.almustkbal.pacs.controllers;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.dcm4che3.tool.dcm2jpg.Dcm2Jpg;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.almustkbal.pacs.components.ActiveDicoms;
import com.almustkbal.pacs.dicom.domain.Dicom;
import com.almustkbal.pacs.dto.DicomViewResultDTO;
import com.almustkbal.pacs.dto.TagDTO;
import com.almustkbal.pacs.entities.Instance;
import com.almustkbal.pacs.entities.Patient;
import com.almustkbal.pacs.entities.Series;
import com.almustkbal.pacs.entities.Study;
import com.almustkbal.pacs.repositories.InstanceRepository;
import com.almustkbal.pacs.repositories.PatientRepository;
import com.almustkbal.pacs.repositories.SeriesRepository;
import com.almustkbal.pacs.repositories.StudyRepository;
import com.almustkbal.pacs.server.DicomReader;
import com.almustkbal.pacs.services.DicomMongoService;
import com.almustkbal.pacs.services.DicomService;
import com.almustkbal.pacs.services.DirectoryWatchService;
import com.almustkbal.pacs.utils.DateUtils;
import com.google.common.eventbus.EventBus;

@CrossOrigin(origins = "*")
@RestController
public class DicomController extends AbstractController {

	private static final Logger LOG = LoggerFactory.getLogger(DicomController.class);

	private static final String JPG_EXT = ".jpg";

	@Value("${pacs.storage.image}")
	private String pacsImageStoragePath;

	@Value("${pacs.storage.dcm}")
	private String pacsDcmStoragePath;

	@Autowired
	PatientRepository patientRepository;

	@Autowired
	StudyRepository studyRepository;

	@Autowired
	SeriesRepository seriesRepository;

	@Autowired
	InstanceRepository instanceRepository;

	@Autowired
	private ActiveDicoms activeDicoms;

	@Autowired
	private DicomService dicomService;
	@Autowired
	private DicomMongoService dicomMongoService;

	@Autowired
	DirectoryWatchService directoryWatchService;

	@Autowired(required = true)
	private EventBus eventBus;

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String index() {
		LOG.debug("index()");
		return "index";
	}

	@RequestMapping(value = "/dicoms/search", method = RequestMethod.GET)
	public Page<Patient> searchDicom(
			@RequestParam(name = "patientName", defaultValue = "", required = false) String patientName,
			@RequestParam(name = "gender", defaultValue = "", required = false) String gender,
			@RequestParam(name = "patientId", defaultValue = "", required = false) String patientId,
			@RequestParam(name = "instituitionName", defaultValue = "", required = false) String instituitionName,
			@RequestParam(name = "	", defaultValue = "", required = false) String physician,
			@RequestParam(name = "modality", defaultValue = "", required = false) List<String> modalities,
			@RequestParam(name = "dateFrom", required = false) String dateFrom,
			@RequestParam(name = "dateTo", required = false) String dateTo,
			Pageable pageable) {

//		System.out.println("patientName = "+patientName);
//		System.out.println("gender = "+gender);
//		System.out.println("patientId = "+patientId);
//		System.out.println("instituitionName = "+instituitionName);
//		System.out.println("physician = "+physician);
//		System.out.println("modalities = "+modalities);
//		System.out.println("dateFrom = "+dateFrom);
//		System.out.println("dateTo = "+dateTo);
		Calendar start = Calendar.getInstance();
		Calendar end = Calendar.getInstance();
		
		if (dateTo != null && dateFrom != null) {
			
			try {
				DateUtils.formatDates(start, end, dateFrom, dateTo);
				
			} catch (ParseException e) {
				e.printStackTrace();
				throw new RuntimeException(e);
			}
			
			
		} else {
			start.add(Calendar.YEAR, -100);
		}

		return dicomService.getPatients(patientName, gender, patientId, instituitionName, physician, modalities, start.getTime(), end.getTime(), pageable);

	}

	@PostMapping("/dicoms")
	public ResponseEntity<Dicom> createDicom(@RequestParam("file") MultipartFile multipart) {
		try {
			File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + multipart.getOriginalFilename());

			multipart.transferTo(convFile);
			DicomReader reader = new DicomReader(convFile);
			Dicom dicom = dicomMongoService.createDicom(reader);
			return new ResponseEntity<Dicom>(dicom, HttpStatus.OK);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}

	}

	@PostMapping("/dicoms/upload")
	public ResponseEntity<DicomViewResultDTO> handleDicomFileUpload(@RequestParam("file") MultipartFile multipart,
			@RequestParam("save") boolean save) {
		DicomViewResultDTO dicomViewResultDTO = new DicomViewResultDTO();
		Patient patient = null;
		List<TagDTO> tags = new ArrayList<TagDTO>();
		try {
			File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + multipart.getOriginalFilename());
			multipart.transferTo(convFile);
//			
//			NewDicomEvent dicomEvent = new NewDicomEvent(convFile);
//			eventBus.post(dicomEvent);

			DicomReader reader = new DicomReader(convFile);

			LOG.info("Active Dicoms:{} Received Patient Name:{} ID:{} Age:{} Sex:{} ", activeDicoms.toString(),
					reader.getPatientName(), reader.getPatientID(), reader.getPatientAge(), reader.getPatientSex());
			synchronized (dicomService) {
				patient = dicomService.buildEntities(reader, save);// lets build our dicom database entities
			}
//			tags = dicomService.getDicomTags(reader);
//			dicomViewResultDTO.setAllTags(tags);
			dicomViewResultDTO.setPatient(patient);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
		return new ResponseEntity<DicomViewResultDTO>(dicomViewResultDTO, HttpStatus.OK);
	}

//	@RequestMapping(value = "/patients", method = RequestMethod.GET)
//	public Page<Patient> getPatients(Pageable pageable) {
//		return dicomService.getPatients(pageable);
//	}

	@RequestMapping(value = "/patients/{pkTBLPatientID}", method = RequestMethod.DELETE)
	public void getPatients(@PathVariable Long pkTBLPatientID) {
		dicomService.deletePatient(pkTBLPatientID);
	}

	@RequestMapping(value = "/images/{pkTBLInstanceID}", method = RequestMethod.GET)
	public ResponseEntity<byte[]> getImage(@PathVariable Long pkTBLInstanceID, HttpServletRequest request,
			HttpServletResponse response) throws IOException {

		java.io.File tempImage = null;
		LOG.info("instanceRepository.findById( pkTBLInstanceID = " + pkTBLInstanceID);
		Instance instance = instanceRepository.findByPkTBLInstanceID(pkTBLInstanceID);
		LOG.info("instance = " + instance);
		if (instance != null) {
			File dicomFile = new File(pacsDcmStoragePath + "/" + instance.getMediaStorageSopInstanceUID() + ".dcm");

			// TEMP IMAGE FILE CREATION
			Dcm2Jpg dcm2Jpg = null;
			try {
				dcm2Jpg = new Dcm2Jpg();// Dcm2Jpg isn't thread safe (due to ImageIO), so need to create a new instance
										// each thread...
				dcm2Jpg.initImageWriter("JPEG", "jpeg", null, null, null); // default JPEG writer class,
																			// compressionType, and quality
				String newfilename = FilenameUtils.removeExtension(dicomFile.getName()) + JPG_EXT; // remove the .dcm
																									// and assign a JPG
																									// extension
				tempImage = new java.io.File(pacsImageStoragePath, newfilename); // create the temporary image file
																					// instance
				dcm2Jpg.convert(dicomFile, tempImage);// save the new jpeg into the .img temp folder
				if (!tempImage.exists()) {
					throw new Exception(); // if not exists, throw exception to log and return back
				}

			} catch (Exception e) {
				LOG.error("failed convert {} to jpeg... Exception: {}", dicomFile, e.getMessage()); // shouldn't care...
			}
			// END OF TEMP FILE CREATION

			final HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.IMAGE_JPEG);

			if (tempImage != null) {
				byte[] bytes = IOUtils.toByteArray(new FileInputStream(tempImage));
				return new ResponseEntity<byte[]>(bytes, headers, HttpStatus.CREATED);
			}

		}

		return null;
	}

	@RequestMapping(value = "/serieses", method = RequestMethod.GET)
	public @ResponseBody Page<Series> getSerieses(
			@RequestParam(defaultValue = "0", value = "pkTBLPatientID", required = false) Long pkTBLPatientID,
			@RequestParam(defaultValue = "0", value = "pkTBLStudyID", required = false) Long pkTBLStudyID,
			@RequestParam(defaultValue = "0", value = "pkTBLSeriesID", required = false) Long pkTBLSeriesID) {
		return null;
	}

	@RequestMapping(value = "/live", method = RequestMethod.GET)
	public ResponseEntity<String> live() {
		return new ResponseEntity<String>(activeDicoms.toString(), HttpStatus.OK);
	}

	@RequestMapping(value = "/studies/{pkTBLStudyID}", method = RequestMethod.GET)
	public Study study(@PathVariable Long pkTBLStudyID) {
		return studyRepository.findByPkTBLStudyID(pkTBLStudyID);
	}

	@RequestMapping(value = "/serieses/{pkTBLSeriesID}", method = RequestMethod.GET)
	public @ResponseBody Series series(@PathVariable Long pkTBLSeriesID) {
		return seriesRepository.findByPkTBLSeriesID(pkTBLSeriesID);
	}

	@RequestMapping(value = "/instances/{pkTBLInstanceID}", method = RequestMethod.GET)
	public @ResponseBody Instance instance(@PathVariable Long pkTBLInstanceID) {
		return instanceRepository.findByPkTBLInstanceID(pkTBLInstanceID);
	}

	@RequestMapping(value = "/patients/{pkTBLPatientID}", method = RequestMethod.GET)
	public @ResponseBody Patient patient(@PathVariable Long pkTBLPatientID) {
		return patientRepository.findByPkTBLPatientID(pkTBLPatientID);
	}
}
