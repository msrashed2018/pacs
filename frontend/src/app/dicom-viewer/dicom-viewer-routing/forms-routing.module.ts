import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { DicomViewerComponent } from '../dicom-viewer.component';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DicomViewerComponent,
    data: {
      title: 'Dicom Viewer Works'
    }
  }
];
@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [
      RouterModule
    ]
})
export class DicomViewerRoutingModule { }
