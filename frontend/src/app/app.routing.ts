import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlankTemplateComponent } from './template/blank-template.component';
import { LeftNavTemplateComponent } from './template/left-nav-template.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [{
  path: '',
  redirectTo: 'dashboard',
  pathMatch: 'full'
}, {
  path: '',
  component: LeftNavTemplateComponent,
  data: {
    title: ''
  },
  children: [
    {
      path: 'dashboard',
      loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      data: {
        title: 'Dashboard Page'
      },
    },
    {
      path: 'ui-elements',
      loadChildren: () => import('./ui-elements/ui-elements.module').then(m => m.UiElementsModule),
      data: {
        title: 'UI Elements'
      },
    },
    {
      path: 'forms',
      loadChildren: () => import('./forms/forms.module').then(m => m.FormsModule),
      data: {
        title: 'Form Page'
      },
    },
    {
      path: 'dicom-viewer',
      loadChildren: () => import('./dicom-viewer/dicom-viewer.module').then(m => m.DicomViewerModule),
      data: {
        title: 'Viewer'
      },
    },
    {
      path: 'dicoms',
      loadChildren: () => import('./dicoms/dicoms.module').then(m => m.DicomsModule)
    },
    {
      path: 'configuration',
      loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule)
    }
  ]
},
{
  path: '**',
  component: PageNotFoundComponent
}];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {
}
