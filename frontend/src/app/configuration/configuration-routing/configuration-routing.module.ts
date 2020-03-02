import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { ConfigurationComponent } from '../configuration.component';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ConfigurationComponent,
    data: {
      title: 'Configuration'
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
export class ConfigurationRoutingModule { }
