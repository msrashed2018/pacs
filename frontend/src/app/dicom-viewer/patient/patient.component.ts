import { Component, OnInit, Input } from '@angular/core';
import { Patient } from 'app/models/patient.model';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {
  @Input('value') patient: Patient ;
  constructor() { }

  ngOnInit() {
  }

}
