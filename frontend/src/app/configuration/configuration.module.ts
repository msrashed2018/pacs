
import { NgModule } from '@angular/core';
import { ConfigurationRoutingModule } from './configuration-routing/configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { ApplicationEntitiesComponent } from './application-entities/application-entities.component';
import { AddApplicationEntityComponent } from './application-entities/add-application-entity/add-application-entity.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DirectoryWatcherComponent } from './directory-watcher/directory-watcher.component';
import {
  MatInputModule,
  MatDialogModule,
  MatDialog,
  MatDialogRef,
} from '@angular/material';
@NgModule({
  imports: [
    ConfigurationRoutingModule,
    CommonModule,
    MatTabsModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
  ],
  declarations: [ConfigurationComponent,  ApplicationEntitiesComponent, AddApplicationEntityComponent, DirectoryWatcherComponent],
  providers: [
    // MatDialog,
    // MatDialogRef
  ],
  entryComponents:[
    AddApplicationEntityComponent
  ]
  
})
export class ConfigurationModule { }
