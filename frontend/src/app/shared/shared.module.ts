import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentComponent } from './dicom-tags/equipment/equipment.component';
import { ImageComponent } from './dicom-tags/image/image.component';
import { SeriesComponent } from './dicom-tags/series/series.component';
import { StudyComponent } from './dicom-tags/study/study.component';
import { InstanceComponent } from './dicom-tags/instance/instance.component';
import { DicomTagsComponent } from './dicom-tags/dicom-tags.component';
import { PatientComponent } from './dicom-tags/patient/patient.component';
import { MatTabsModule } from '@angular/material/tabs';

import { MultipleDicomsViewComponent } from './multiple-dicoms-view/multiple-dicoms-view.component';
import { InstancesComponent } from './multiple-dicoms-view/instances/instances.component';
import { EquipmentsComponent } from './multiple-dicoms-view/equipments/equipments.component';
import { PatientsComponent } from './multiple-dicoms-view/patients/patients.component';
import { ImagesComponent } from './multiple-dicoms-view/images/images.component';
import { StudiesComponent } from './multiple-dicoms-view/studies/studies.component';
import { SeriesesComponent } from './multiple-dicoms-view/serieses/serieses.component';
import { AngularImageViewerModule } from 'angular-x-image-viewer';

@NgModule({
  declarations: [
    DicomTagsComponent, PatientComponent , EquipmentComponent, ImageComponent, SeriesComponent, StudyComponent, InstanceComponent, MultipleDicomsViewComponent, InstancesComponent, EquipmentsComponent, PatientsComponent, ImagesComponent, SeriesesComponent, StudiesComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    AngularImageViewerModule
  ],
  exports: [DicomTagsComponent,PatientComponent, EquipmentComponent, ImageComponent, SeriesComponent, StudyComponent, InstanceComponent, InstancesComponent,MultipleDicomsViewComponent, EquipmentsComponent, PatientsComponent, ImagesComponent, SeriesesComponent, StudiesComponent],
  entryComponents:[
    DicomTagsComponent
  ]

})
export class SharedModule { }
