import { Component, OnInit, ViewChild } from '@angular/core';
import { ProperityService } from '../services/properity.service';
import { ProperityModel } from '../models/ProperityModel';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProperityAddModalComponent } from '../properity-add-modal/properity-add-modal.component';
import { EventEmitterService } from '../event-emitter.service';
import { ProjectsModel } from '../models/ProjectsModel';
import { ProjectService } from '../services/project.service';
import { SubscriptionService } from "app/services/subscription.service";
import { ConfigClass, EditPrivilege, ViewPrivilege } from '../config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './properity.component.html',
  styleUrls: ['./properity.component.css']
})
export class ProperityComponent implements OnInit {

  properities: Observable<ProperityModel[]>;
  listOfElements: ProperityModel[];


  displayedColumns: string[] = ['Project', 'ProperityNumber', 'FirstName', 'MobileNumber', 'IdNumber', 'residency'];
  dataSource;
  isChecked;
  projects: ProjectsModel[] = [];
  totalPages = 0;
  filters = {
    ownerIdNumber: '',
    ownerMobile: '',
    ownerName: '',
    projectId: '',
    unitNumber: '',
    page: 0,
    size: 20,
    projects: []
  };

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSortModule) sort: MatSortModule;

  constructor(private properityService: ProperityService, private dialog: MatDialog, private eventEmitterService: EventEmitterService, private projectService: ProjectService,
    private subscriptionService: SubscriptionService, private router: Router
  ) { }

  ngOnInit() {
    this.listAllProperities();
    this.listAllProjects();
    if (this.eventEmitterService.subsVar == undefined) {
      this.eventEmitterService.subsVar = this.eventEmitterService.
        invokeFirstComponentFunction.subscribe((name: string) => {
          this.listAllProperities();
        });
    }
    this.checkPrivilage();
  }

  checkPrivilage() {
    if (ConfigClass.getPrivilageStatus) {
      let willShow = false;
      let privilage = JSON.parse(sessionStorage.getItem("privilage"));
      privilage.forEach(element => {
        if (element.name == EditPrivilege.PROPERTY_EDIT) {
          this.displayedColumns.push("Verify");
          willShow = true;
        }
        else {
          if (element.name == ViewPrivilege.PROPERTY + "_VIEW") {
            willShow = true;
          }
        }
      });
      if (!willShow) {
        this.router.navigate(["dashboard"]);
      }
    } else {
      this.displayedColumns.push("Verify");
    }
  }

  listAllProperities() {

    this.filters.projectId = "";
    this.filters.projects.forEach(element => {
      this.filters.projectId += "&projectId=" + element;
    });

    this.properityService.GetAllProperities(this.filters).subscribe(res => {
      this.properities = res.content;
      this.listOfElements = res.content;
      this.dataSource = new MatTableDataSource<ProperityModel>(this.listOfElements);
      this.totalPages = res.totalPages;
    });
  }

  restAllFilters() {
    this.filters = {
      ownerIdNumber: '',
      ownerMobile: '',
      ownerName: '',
      projectId: '',
      unitNumber: '',
      page: 0,
      size: 20,
      projects: []
    };
    this.listAllProperities();
  }

  listAllProjects() {
    this.subscriptionService.getAllProjects().subscribe(result => {
      this.projects = result.content;
    });
  }

  async openUpdateDialog(property) {
    const dialogRef = this.dialog.open(ProperityAddModalComponent, {
      width: "700px",
      disableClose: true,
      autoFocus: true,
      data: { property: property }
    });
    dialogRef.afterClosed().subscribe(fetchedData => {
      if (fetchedData) {
        this.listAllProperities();
      }
    });
  }

  pagination(type) {
    if (type == "next") {
      if (this.filters.page + 1 <= this.totalPages) {
        this.filters.page += 1;
        this.listAllProperities();
      }
    } else if (type == "back") {
      if (this.filters.page - 1 > -1) {
        this.filters.page -= 1;
        this.listAllProperities();
      }
    } else if (type == "last") {
      this.filters.page = this.totalPages - 1;
      this.listAllProperities();
    } else if (type == "first") {
      this.filters.page = 0;
      this.listAllProperities();
    }
  }

  onPageChange(size) {
    if (this.filters.size != size) {
      this.filters.size = Number(size);
      this.filters.page = 0;
      this.listAllProperities();
    }
  }
}