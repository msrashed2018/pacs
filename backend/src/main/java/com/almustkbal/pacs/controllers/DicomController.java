package com.almustkbal.pacs.controllers;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.almustkbal.pacs.components.ActiveDicoms;
import com.almustkbal.pacs.dicom.commands.DicomFilter;
import com.almustkbal.pacs.domain.Instance;
import com.almustkbal.pacs.domain.Patient;
import com.almustkbal.pacs.domain.Series;
import com.almustkbal.pacs.domain.Study;
import com.almustkbal.pacs.dto.DicomViewResultDTO;
import com.almustkbal.pacs.repositories.InstanceRepository;
import com.almustkbal.pacs.repositories.PatientRepository;
import com.almustkbal.pacs.repositories.SeriesRepository;
import com.almustkbal.pacs.repositories.StudyRepository;
import com.almustkbal.pacs.services.DicomService;
import com.almustkbal.pacs.services.DirectoryWatchService;
import com.almustkbal.pacs.services.FileStorageService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class DicomController extends AbstractController {

	private static final Logger LOG = LoggerFactory.getLogger(DicomController.class);

	private static final String JPG_EXT = ".jpg";

//	@Value("${pacs.storage.image}")
//	private String pacsImageStoragePath;

	@Value("${files.storage.path}")
	private String mainStoragePath;

	public static final String UPLOADED_DICOMS_BASIC_DIRECTORY = "/dicom-uploader";

	public static final String DICOM_FILE_NAME = "dicom";

	@Autowired
	private FileStorageService fileStorageService;

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
	DirectoryWatchService directoryWatchService;

//	@Autowired(required = true)
//	private EventBus eventBus;

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String index() {
		LOG.debug("index()");
		return "index";
	}

	@RequestMapping(value = "/dicoms/search", method = RequestMethod.GET)
	public Page<Patient> searchDicom(DicomFilter dicomFilter, Pageable pageable) {
		return dicomService.getPatients(dicomFilter, pageable);
	}

	@PostMapping("/dicoms/view")
	public ResponseEntity<DicomViewResultDTO> viewDicom(@RequestParam("file") MultipartFile multipart) {
		DicomViewResultDTO dicomViewResultDTO = new DicomViewResultDTO();
		Patient patient = new Patient();
		try {

//			File convFile = new File(mainStoragePath + "/" + multipart.getOriginalFilename());

			Path filepath = Paths.get(mainStoragePath, multipart.getOriginalFilename());
			try (OutputStream os = Files.newOutputStream(filepath)) {
				os.write(multipart.getBytes());
			}

//			multipart.transferTo(convFile);

//			DicomReader reader = new DicomReader(filepath.toFile());
//			String dicomFileName = reader.getSOPInstanceUID() + ".dcm";

			patient = dicomService.buildEntities(filepath.toFile());
			dicomViewResultDTO.setPatient(patient);
			filepath.toFile().delete();
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
		return new ResponseEntity<DicomViewResultDTO>(dicomViewResultDTO, HttpStatus.OK);
	}

	@PostMapping("/dicoms/upload")
	public ResponseEntity<DicomViewResultDTO> uploadDicom(@RequestParam("file") MultipartFile multipart) {
		DicomViewResultDTO dicomViewResultDTO = new DicomViewResultDTO();
		boolean isFileSaved = false;
		Patient patient = null;
		File dicomFile = null;
		try {

			dicomFile = fileStorageService.storeFile(UPLOADED_DICOMS_BASIC_DIRECTORY, multipart, DICOM_FILE_NAME, true);
			isFileSaved = true;

			synchronized (dicomService) {
				patient = dicomService.buildAndSaveEntities(dicomFile);// lets build our dicom database entities
			}
			dicomViewResultDTO.setPatient(patient);

		} catch (Exception e) {
			if (isFileSaved) {
				dicomFile.delete();
			}
			throw new RuntimeException(e);
		}
		return new ResponseEntity<DicomViewResultDTO>(dicomViewResultDTO, HttpStatus.OK);
	}

	@RequestMapping(value = "/patients/merge", method = RequestMethod.PUT)
	public void mergePatient(@RequestParam("patientID") String patientID, @RequestBody List<String> patientIds) {
		dicomService.mergePatient(patientID, patientIds);
	}

//	@RequestMapping(value = "/patients", method = RequestMethod.GET)
//	public Page<Patient> getPatients(Pageable pageable) {
//		return dicomService.getPatients(pageable);
//	}

	@RequestMapping(value = "/patients/{patientID}", method = RequestMethod.DELETE)
	public void deletePatient(@PathVariable String patientID) {
		dicomService.deletePatient(patientID);
	}

	@RequestMapping(value = "/images/{pkTBLInstanceID}", method = RequestMethod.GET)
	public ResponseEntity<byte[]> getImage(@PathVariable Long pkTBLInstanceID, HttpServletResponse response)
			throws IOException {

		java.io.File tempImage = null;
		Instance instance = instanceRepository.findByPkTBLInstanceID(pkTBLInstanceID);
		if (instance != null) {
//			File dicomFile = new File(pacsDcmStoragePath + "/" + instance.getMediaStorageSopInstanceUID() + ".dcm");
			File dicomFile = new File(instance.getDicomFilePath());
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
				tempImage = new java.io.File(System.getProperty("java.io.tmpdir"), newfilename); // create the temporary
																									// image file
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
				tempImage.delete();
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