import { Component, OnInit, Input, Inject } from '@angular/core';
import { STEPS } from 'app/models/viewflow.model';
import { Patient } from 'app/models/patient.model';
import { Study } from 'app/models/study.model';
import { Series } from 'app/models/series.model';
import { Equipment } from 'app/models/equipment.model';
import { Instance } from 'app/models/instance.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-multiple-dicoms-view',
  templateUrl: './multiple-dicoms-view.component.html',
  styleUrls: ['./multiple-dicoms-view.component.css']
})
export class MultipleDicomsViewComponent implements OnInit {
  selectedTabIndex: number = 0;
  
  patients: Patient;
  studies: Study[];
  serieses: Series[];
  equipment: Equipment;
  instances: Instance[];
  studyTabEnabled: boolean = false;
  seriesTabEnabled: boolean = false;
  instanceTabEnabled: boolean = false;
  equipmentTabEnabled: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<MultipleDicomsViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    
    this.patients=this.data.patients;
  }

  onTabChanged(tabIndex) {
    if (tabIndex == STEPS.PATIENT) {
      this.studyTabEnabled = false;
      this.seriesTabEnabled = false;
      this.instanceTabEnabled = false;
      this.equipmentTabEnabled = false;
    }
  }


  onPatientSelected(patient) {
    this.studyTabEnabled = true;
    this.studies = patient.studies;
    this.selectedTabIndex = STEPS.STUDY; //moving into study tab
  }

  onStudySelected(study: Study) {
    this.seriesTabEnabled = true;
    this.serieses = study.serieses;
    this.selectedTabIndex = STEPS.SERIES; //moving into Series tab
  }

  onSeriesSelected(series: Series) {
    this.instanceTabEnabled = true;
    this.instances = series.instances;
    this.selectedTabIndex = STEPS.INSTANCE; //moving into Instance tab
  }

}
