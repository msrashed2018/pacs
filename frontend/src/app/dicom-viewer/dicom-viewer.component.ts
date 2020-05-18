import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { DicomViewResult } from 'app/models/dicom-view-result.model';
import { DicomTagsComponent } from 'app/shared/dicom-tags/dicom-tags.component';
import { DicomsService } from 'app/services/dicoms.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dicom-viewer',
  templateUrl: './dicom-viewer.component.html',
  styleUrls: ['./dicom-viewer.component.css']
})
export class DicomViewerComponent implements OnInit {
  dicomFile: File;
  viewingDicom: boolean;
  progress: { percentage: number } = { percentage: 0 }

  data : DicomViewResult;
  public pageData;

  constructor(
    router: Router,
    private route: ActivatedRoute,
    private dicomService: DicomsService,
    public dialog: MatDialog) {

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
            this.data = result.body as DicomViewResult
            this.openDicomTagsDialog(this.data);
          }

        },
        error => {
          console.log('oops', error.error)
        }
      )

    }
  }



  openDicomTagsDialog(dicom: DicomViewResult): void {

    const dialogRef = this.dialog.open(DicomTagsComponent, {
      width: '90%',
      height: '90%',
      data: dicom
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
