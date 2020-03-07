
import { NgModule } from '@angular/core';
import { DicomViewerComponent } from './dicom-viewer.component';
import { DicomViewerRoutingModule } from './dicom-viewer-routing/forms-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { PatientComponent } from './patient/patient.component';
import { StudyComponent } from './study/study.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { InstanceComponent } from './instance/instance.component';
import { SeriesComponent } from './series/series.component';
import { ImageComponent } from './image/image.component';
import { CommonModule } from '@angular/common';
import { ImageViewerModule } from 'ng2-image-viewer';
@NgModule({
  imports: [
    CommonModule,
    DicomViewerRoutingModule,
    MatTabsModule,
    ImageViewerModule
  ],
  declarations: [ DicomViewerComponent, PatientComponent, StudyComponent, EquipmentComponent, InstanceComponent, SeriesComponent, ImageComponent],
  providers: []
})
export class DicomViewerModule { }
