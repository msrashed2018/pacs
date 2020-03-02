import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Study } from '../../models/study.model';

@Component({
  selector: 'app-studies',
  templateUrl: './studies.component.html',
  styleUrls: ['./studies.component.scss']
})
export class StudiesComponent implements OnInit {
 @Input('value') studies: Study[];
 @Output('studySelected') study : EventEmitter<Study>= new EventEmitter<Study>();
  constructor() { }

  ngOnInit() {
    console.log("studies")
  }
  onStudySelected(selectedStudy: Study){
    this.study.emit(selectedStudy);
  }
}
