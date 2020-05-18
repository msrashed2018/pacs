import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Study } from '../../../models/study.model';
import { MatDialog } from '@angular/material/dialog';
import { StudyComponent } from 'app/shared/dicom-tags/study/study.component';

@Component({
  selector: 'app-studies',
  templateUrl: './studies.component.html',
  styleUrls: ['./studies.component.scss']
})
export class StudiesComponent implements OnInit {
 @Input('value') studies: Study[];
 @Output('studySelected') study : EventEmitter<Study>= new EventEmitter<Study>();
  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
  }
  onStudySelected(selectedStudy: Study){
    this.study.emit(selectedStudy);
  }

  onView(studyObj){
    const dialogRef = this.dialog.open(StudyComponent, {
      width: "1000px",
      height:"900px",
      disableClose: false,
      autoFocus: true,
      
      data: {
        study: studyObj
      }
    });
    dialogRef.afterClosed().subscribe(fetchedData => {
      if (fetchedData) {
      }
    }); 
  }
}
