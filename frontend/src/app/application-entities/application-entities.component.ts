import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddApplicationEntityComponent } from './add-application-entity/add-application-entity.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApplicationEntity } from 'app/models/application-entity.model';
import { ApplicationEntityService } from 'app/services/application-entity.service';

@Component({
  selector: 'app-application-entities',
  templateUrl: './application-entities.component.html',
  styleUrls: ['./application-entities.component.css']
})
export class ApplicationEntitiesComponent implements OnInit {
  entities: ApplicationEntity[];
  //pagination variables
  maxSize: number = 10;
  totalItems: number = 0;
  currentPage: number = 0;
  numPages: number = 0;
  items: number = 0;
  itemsPerPage: number = 10;

  constructor(
    private applicationEntityService: ApplicationEntityService,
    public dialog: MatDialog
  ) { }


  pageChanged(event: any): void {
    this.items = (event.page - 1) * this.itemsPerPage;
    this.currentPage = event.page - 1;
    this.refreshData();
  }

  
  ngOnInit() {
    this.entities = [];
    this.refreshData();
  }
  refreshData() {
    this.applicationEntityService.retrieveApplicationEntities(this.currentPage, this.itemsPerPage)
      .subscribe(
        result => {
          if (typeof result !== 'undefined' && result !== null && result['content'].length != 0) {
            this.entities = result['content'];
            this.totalItems = result['totalElements'];
          } else {
            this.entities = [];
          }
        },
        error => {
          console.log('oops: ', error);
        }
      );
  }

  onStart(entityId){
    this.applicationEntityService.startApplicationEntity(entityId)
    .subscribe(
      result => {
        this.refreshData();
      },
      error => {
        console.log('oops: ', error);
      }
    );
  }


  onStop(entityId){
    this.applicationEntityService.stopApplicationEntity(entityId)
    .subscribe(
      result => {
        this.refreshData();
      },
      error => {
        console.log('oops: ', error);
      }
    );
  }


  onAdd() {
  this.openDialog()
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(AddApplicationEntityComponent, {
      width: '60%',
      // data: this.entity
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.refreshData()
    });
  }
}
