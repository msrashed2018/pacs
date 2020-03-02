import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PATIENTS_PAGE_SIZE, PATIENTS_PAGE_SORT, NO_DATA_FOUND } from 'app/config';
import { DicomsService } from '../dicoms.service';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  // @Input() count: number = 0;
  @Output('patientSelected') patient : EventEmitter<Patient>= new EventEmitter<Patient>();

  patients: Patient[];
  noDataFound = "";
  isAdmin: boolean = false;

  //pagination variables
  maxSize = 3;
  totalItems: number = 0;
  currentPage: number = 0;
  numPages: number = 0;
  items: number = 0;
  itemsPerPage: number = PATIENTS_PAGE_SIZE;
  constructor(
    private dicomsService: DicomsService

  ) { }

  ngOnInit() {
    this.refreshData(this.currentPage);
  }

  pageChanged(event: any): void {
    this.items = (event.page - 1) * this.itemsPerPage;
    this.refreshData(event.page - 1);
  }
  refreshData(page) {
    this.dicomsService.getPatients(page, PATIENTS_PAGE_SIZE, PATIENTS_PAGE_SORT).subscribe(
      response => {
        this.patients = response['content'];
        this.totalItems = response['totalElements'];
        if (response['content'].length != 0) {
          this.noDataFound = "";
        } else {
          this.noDataFound = NO_DATA_FOUND;
        }
      }
    )
  }

  onPatientSelected(selectedPatient: Patient){
    this.patient.emit(selectedPatient);
  }
}
