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
image='https://picsum.photos/900/500/?random'
  dicomFile: File;
  viewingDicom: boolean;
  progress: { percentage: number } = { percentage: 0 }

  data : DicomViewResult;
  public pageData;

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

      this.dicomService.viewDicom(this.dicomFile).subscribe(
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
