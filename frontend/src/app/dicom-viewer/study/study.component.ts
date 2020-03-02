import { Component, OnInit, Input } from '@angular/core';
import { Study } from 'app/models/study.model';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit {
  @Input('value') study: Study;
  constructor() { }

  ngOnInit() {
  }

}
