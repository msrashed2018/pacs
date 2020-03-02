import { Component, OnInit } from '@angular/core';
import { DicomsService } from './dicoms.service';
import { Study } from '../models/study.model';
import { STEPS } from './viewflow.model';
import { Series } from '../models/series.model';
import { Equipment } from '../models/equipment.model';
import { Instance } from '../models/instance.model';

@Component({
  selector: 'app-dicoms',
  templateUrl: './dicoms.component.html',
  styleUrls: ['./dicoms.component.scss']
})
export class DicomsComponent implements OnInit {
  selectedTabIndex : number = 0;
  studies: Study[];
  serieses: Series[];
  equipment: Equipment;
  instances: Instance[];
  studyTabEnabled : boolean = false;
  seriesTabEnabled : boolean = false;
  instanceTabEnabled : boolean = false;
  equipmentTabEnabled: boolean = false;
  constructor(


  ) { }

  ngOnInit() {
  }

  onTabChanged(tabIndex){
    if(tabIndex == STEPS.PATIENT){
      this.studyTabEnabled = false;
      this.seriesTabEnabled = false;
      this.instanceTabEnabled = false;
      this.equipmentTabEnabled= false;
    }
  }


  onPatientSelected(patient){
    this.studyTabEnabled = true;
    this.studies = patient.studies;
    this.selectedTabIndex = STEPS.STUDY; //moving into study tab
  }

  onStudySelected(study : Study){
    this.seriesTabEnabled = true;
    this.serieses = study.serieses;
    this.selectedTabIndex = STEPS.SERIES; //moving into study tab
  }

  onSeriesSelected(series : Series){
    this.instanceTabEnabled = true;
    this.instances = series.instances;
    this.selectedTabIndex = STEPS.INSTANCE; //moving into study tab
  }

}
