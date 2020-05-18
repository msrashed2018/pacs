import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PATIENTS_PAGE_SIZE, PATIENTS_PAGE_SORT, NO_DATA_FOUND } from 'app/config';
import { Patient } from '../../../models/patient.model';
import { PatientFilter } from 'app/models/patient-filter.model';
import { DicomsService } from 'app/services/dicoms.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {

  @Output('patientSelected') patient : EventEmitter<Patient>= new EventEmitter<Patient>();
  @Input('page') currentPage: number = 0;
  @Input('patients') patients: Patient[];

  isAdmin: boolean = false;
  constructor(
    private dicomsService: DicomsService

  ) { }

  ngOnInit() {
    
  }
  onPatientSelected(selectedPatient: Patient){
    this.patient.emit(selectedPatient);
  }
}
