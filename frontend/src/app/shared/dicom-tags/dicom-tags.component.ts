import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, Inject, Optional } from '@angular/core';
import { Patient } from 'app/models/patient.model';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { DicomViewResult } from 'app/models/dicom-view-result.model';
import { Instance } from 'app/models/instance.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dicom-tags',
  templateUrl: './dicom-tags.component.html',
  styleUrls: ['./dicom-tags.component.scss']
})
export class DicomTagsComponent implements OnInit {
  @Input('dicom') dataFromBind: DicomViewResult;
  public data: DicomViewResult;
  constructor(
    @Optional() public dialogRef: MatDialogRef<DicomTagsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dicomTags: DicomViewResult
    ) {
      
  }

  ngOnInit() {
    if(this.dataFromBind ==null){
      this.data = this.dicomTags
    }else{
      this.data = this.dataFromBind
    }


    
    
  }
}
