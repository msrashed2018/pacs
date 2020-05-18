import { Component, OnInit, Input, Inject } from '@angular/core';
import { Study } from 'app/models/study.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit {
  @Input('value') study: Study;
  constructor(
    public dialogRef: MatDialogRef<StudyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit() {


    if(this.data.study){
      this.study=this.data.study;
    }
  }

}
