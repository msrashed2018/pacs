import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FileUploader} from "ng2-file-upload";
import {Observable} from "rxjs";
import {HttpClient, HttpResponse, HttpEventType} from "@angular/common/http";
import { DicomViewResult } from 'app/models/dicom-view-result.model';
import { DicomsService } from 'app/dicoms/dicoms.service';
import { MatDialog } from '@angular/material';
import { AllTagsComponent } from 'app/shared/all-tags/all-tags.component';
import { MAX_DICOM_FILE_UPLOAD_SIZE } from 'app/config';
@Component({
  selector: 'app-dicoms-upload',
  templateUrl: './dicoms-upload.component.html',
  styleUrls: ['./dicoms-upload.component.scss']
})
export class DicomsUploadComponent implements OnInit {
  selectedDicom: DicomViewResult;
  fileNames: string[] = [];
  progress: Array<{ percentage: number } >= new Array();
  onSelect(dicom: DicomViewResult): void {
    this.selectedDicom = dicom;
  }

  uploadDicoms : DicomViewResult[] = [];
  public uploader:FileUploader = new FileUploader({
    isHTML5: true
  });
  title: string = 'Angular File Upload';
  constructor(
    private dicomService: DicomsService, 
    private fb: FormBuilder, 
    private http: HttpClient ,
    public dialog: MatDialog
    ) { }

  uploadSubmit(event){
    // this.uploader.clearQueue();
    this.fileNames = [];
        for (var i = 0; i < this.uploader.queue.length; i++) {
          let fileItem = this.uploader.queue[i]._file;
          if(fileItem.size > MAX_DICOM_FILE_UPLOAD_SIZE){
            // alert("Each File should be less than 1 MB of size.");
            alert("File: "+fileItem.name +" exceed maximum size allowed per each file (5 MB)");
            return;
          }
          this.progress[i] =  { percentage: 0 };
          this.fileNames[i] = fileItem.name ;
          this.uploadDicoms[i] = new DicomViewResult();
          
        }
        for (var j = 0; j < this.uploader.queue.length; j++) {
          // let data = new FormData();
          let fileItem = this.uploader.queue[j]._file;
          let index = j;
          // data.append('file', fileItem);
          // data.append('fileSeq', 'seq'+j);
          this.dicomService.uploadDicom( fileItem).subscribe(
            result => {
              if (result.type === HttpEventType.UploadProgress) {
                this.progress[index].percentage = Math.round(100 * result.loaded / result.total);
              } else if (result instanceof HttpResponse) {
                // console.log("file uploaded success");
                this.uploadDicoms[index] = result.body as DicomViewResult
              }
    
            },
            error => {
              console.log('oops', error.error)
            }
          )
        }
        this.uploader.clearQueue();
  }



  ngOnInit() {
  }
  onUploadBtnClicked(event) {

  }


  onViewTags(index){
    console.log(index);
    this.openDialog()
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(AllTagsComponent, {
      width: '60%',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
