import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DicomsRoutingModule } from './dicoms-routing/dicoms-routing.module';
import { DicomsComponent } from './dicoms.component';
import { MatTabsModule } from '@angular/material/tabs';
import { PatientsComponent } from './patients/patients.component';
import { StudiesComponent } from './studies/studies.component';
import { SeriesComponent } from './series/series.component';
import { InstancesComponent } from './instances/instances.component';
import { ImagesComponent } from './images/images.component';
import { EquipmentsComponent } from './equipments/equipments.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { DicomsUploadComponent } from './dicoms-upload/dicoms-upload.component';
import { FileUploadModule} from "ng2-file-upload";
import { MatInputModule, MatDialogModule } from '@angular/material';
import { ImageViewerModule } from 'ng2-image-viewer';
@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    DicomsRoutingModule,
    FormsModule,
    AlertModule,
    PaginationModule.forRoot(),
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    FileUploadModule,
    MatInputModule,
    MatDialogModule,
    ImageViewerModule
  ],
  declarations: [DicomsComponent, PatientsComponent, StudiesComponent, SeriesComponent, InstancesComponent, ImagesComponent, EquipmentsComponent, AdvancedSearchComponent, DicomsUploadComponent]
,schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DicomsModule { }
