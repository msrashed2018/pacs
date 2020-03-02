import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Patient } from 'app/models/patient.model';
import { DicomsService } from 'app/dicoms/dicoms.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { DicomViewResult } from 'app/models/dicom-view-result.model';

@Component({
  selector: 'app-dicom-viewer',
  templateUrl: './dicom-viewer.component.html',
  styleUrls: ['./dicom-viewer.component.scss']
})
export class DicomViewerComponent implements OnInit {

  dicomFile: File;
  viewingDicom: boolean;
  progress: { percentage: number } = { percentage: 0 }

  data : DicomViewResult;
  public pageData;
  study: any = {
    "studyID": "4460172",
    "studyDescription": "UCLA Head 3T^Routine",
    "studyInstanceUID": "1.2.840.113745.101000.1008000.38446.6272.7138759",
    "accessionNumber": "2459413",
    "studyDateTime": "2005-04-22T11:27:19.468+0000",
    "referringPhysicianName": "MARTIN^NEIL",
    "additionalPatientHistory": null,
    "admittingDiagnosesDescription": null,
    "studyStatusID": null,
    "studyPriorityID": null
  };
  series: any = {
    "seriesInstanceUID": "1.3.12.2.1107.5.2.13.20561.30010005042219430807800001431",
    "seriesNumber": 56,
    "seriesDescription": "MIP thin cor",
    "bodyPartExamined": null,
    "patientPosition": "HFS",
    "laterality": null,
    "protocolName": "CEMRA_HIGHRES",
    "operatorsName": "meduser",
    "seriesDateTime": "2005-04-22T11:27:19.468+0000"
  }

  equipment: any = {
    "modality": "MR",
    "conversionType": null,
    "stationName": "SMR4-MP3",
    "institutionName": "UCLA MP300",
    "institutionAddress": "300Medical Plaza, Los Angeles-D6F328-06/02/05, Los Angeles, 90085, USA",
    "institutionalDepartmentName": null,
    "manufacturer": "SIEMENS",
    "manufacturerModelName": "Trio",
    "softwareVersion": "syngo MR 2004A 4VA25A",
    "deviceSerialNumber": "20561"
  }

  instance: any = {
    "sopInstanceUID": "1.3.12.2.1107.5.2.13.20561.30010005042219430807800001386",
    "sopClassUID": "1.2.840.10008.5.1.4.1.1.4",
    "instanceNumber": 74,
    "patientOrientation": null,
    "mediaStorageSopInstanceUID": "1.3.12.2.1107.5.2.13.20561.30010005042219430807800001386",
    "transferSyntaxUID": "1.2.840.10008.1.2.1",
    "acquisitionDateTime": "2005-04-22T10:31:48.077+0000",
    "imageType": "DERIVED",
    "pixelSpacing": 0.667011,
    "imageOrientation": null,
    "imagePosition": null,
    "sliceThickness": 5.0,
    "sliceLocation": 0.0,
    "windowCenter": "147",
    "windowWidth": "378",
    "xrayTubeCurrent": 0,
    "exposureTime": 0,
    "kvp": null
  }
  patient: any = {
    "@pkTBLPatientID": 1,
    "pkTBLPatientID": 2,
    "patientID": "7DfDKDK",
    "patientName": "FELIX",
    "patientSex": null,
    "patientBirthday": "1922-02-11",
    "patientAge": "083Y"
  }





  constructor(
    router: Router,
    private route: ActivatedRoute,
    private dicomService: DicomsService) {

  }

  ngOnInit() {
    this.pageData = <any>this.route.snapshot.data;
    // console.log(this.pageData.title)

  }
  onUploadBtnClicked(event) {

    this.progress.percentage = 0;
    this.viewingDicom = false;
  }
  onDicomFileSelected(event) {
    this.dicomFile = event.target.files[0];
    if (this.dicomFile != null) {
      this.viewingDicom = true;

      this.dicomService.uploadDicom(false, this.dicomFile).subscribe(
        result => {
          if (result.type === HttpEventType.UploadProgress) {
            this.progress.percentage = Math.round(100 * result.loaded / result.total);

          } else if (result instanceof HttpResponse) {
            // console.log("file uploaded success");
            this.data = result.body as DicomViewResult
            
          }

        },
        error => {
          console.log('oops', error.error)
        }
      )

    }
  }

}
