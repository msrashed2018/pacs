import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DicomsComponent } from '../dicoms.component';
import { PatientsComponent } from '../patients/patients.component';
import { StudiesComponent } from '../studies/studies.component';
import { ImagesComponent } from '../images/images.component';
import { SeriesComponent } from '../series/series.component';
import { InstancesComponent } from '../instances/instances.component';
import { DicomsUploadComponent } from '../dicoms-upload/dicoms-upload.component';

const routes: Routes = [
  {
  path: 'search',
  pathMatch: 'full',
  component: DicomsComponent,
  data: {
    title: 'Search'
    }
  }, {
    path: 'upload',
    pathMatch: 'full',
    component: DicomsUploadComponent,
    data: {
      title: 'Upload'
      }
    }

// {
//   path: 'patients',
//   pathMatch: 'full',
//   component: PatientsComponent,
//   data: {
//     title: 'Patients'
//   }
// },
// {
//   path: 'studies',
//   pathMatch: 'full',
//   component: StudiesComponent,
//   data: {
//     title: 'Studies'
//   }
// },
// {
//   path: 'images',
//   pathMatch: 'full',
//   component: ImagesComponent,
//   data: {
//     title: 'Images'
//   }
// },
// {
//   path: 'series',
//   pathMatch: 'full',
//   component: SeriesComponent,
//   data: {
//     title: 'Series'
//   }
// },
// {
//   path: 'instances',
//   pathMatch: 'full',
//   component: InstancesComponent,
//   data: {
//     title: 'Instances'
//   }
// }




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DicomsRoutingModule { }
