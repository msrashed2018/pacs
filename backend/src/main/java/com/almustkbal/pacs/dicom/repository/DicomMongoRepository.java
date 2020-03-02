package com.almustkbal.pacs.dicom.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.almustkbal.pacs.dicom.domain.Dicom;

public interface DicomMongoRepository extends MongoRepository<Dicom, String>, DicomMongoRepositoryCustom {

//    Dicom findFirstByDicom(String Dicom);
//
//    Dicom findByDicomAndDisplayAds(String Dicom, boolean displayAds);
//
//    //Mongo JSON query string
//    @Query("{Dicom:'?0'}")
//    Dicom findCustomByDicom(String Dicom);
//
//    @Query("{Dicom: { $regex: ?0 } })")
//    List<Dicom> findCustomByRegExDicom(String Dicom);

}
