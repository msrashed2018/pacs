import { Component, OnInit, ViewChildren, QueryList } from "@angular/core";
import { ProjectService } from "app/services/project.service";
import { ProjectsModel } from "app/models/ProjectsModel";
import { MatDialog } from "@angular/material/dialog";
import { ProjectsAddModalComponent } from "app/projects-add-modal/projects-add-modal.component";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { TableUtil } from "app/models/TableUtil";
import { ConfigClass, EditPrivilege, ViewPrivilege } from "../config";
import { Router } from "@angular/router";

@Component({
  selector: "app-icons",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.css"]
})
export class ProjectsComponent implements OnInit {
  isChecked;
  projects: ProjectsModel[] = [];
  project: ProjectsModel = {};
  dataSource;

  displayedColumns: string[] = [
    "Name",
    "NoOfUnits",
    "activeUnitsCount",
    "securityEnabled",
    "subscriptionEnabled",
    "homeService",
    "status"
  ];
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  accessCards: ProjectsModel[] = [];
  filter = {
    securityEnabled: false,
    subscriptionEnabled: false,
    homeServicesEnabled: false,
    enabled: false,
    securityEnabled_notactive: false,
    subscriptionEnabled_notactive: false,
    homeServicesEnabled_notactive: false,
    enabled_notactive: false,
    page: 0,
    size: 20,
    selectedFeatures: [], //["sec", "home", "sub", "enabled"],
    selectedFeatures_notactive: [] //["sec", "home", "sub", "enabled"]
  };
  totalPages: 0;
  showAddBtn = false;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.listAllProjects();
    this.checkPrivilage();
  }

  checkPrivilage() {
    if (ConfigClass.getPrivilageStatus) {
      let willShow = false;
      let privilage = JSON.parse(sessionStorage.getItem("privilage"));
      privilage.forEach(element => {
        if (element.name == EditPrivilege.PROJECTS_EDIT) {
          this.displayedColumns.push("Action");
          this.showAddBtn = true;
          willShow = true;
        } else {
          if (element.name == ViewPrivilege.PROJECTS + "_VIEW") {
            willShow = true;
          }
        }
      });
      if (!willShow) {
        this.router.navigate(["dashboard"]);
      }
    } else {
      this.displayedColumns.push("Action");
      this.showAddBtn = true;
    }
  }

  listAllProjects() {
    this.projectService
      .GetProjects(this.filter)
      .subscribe(OuterContainsProject => {
        this.projects = OuterContainsProject
          ? OuterContainsProject.content
          : null;
        this.dataSource = new MatTableDataSource<ProjectsModel>(this.projects);
        this.totalPages = OuterContainsProject.totalPages;
      });
  }

  filterProjectsStatus(evt) {
    this.filter.securityEnabled = false;
    this.filter.subscriptionEnabled = false;
    this.filter.homeServicesEnabled = false;
    this.filter.enabled = false;

    evt.value.forEach(element => {
      if (element == "sec") {
        this.filter.securityEnabled = true;
        this.filter.securityEnabled_notactive = false;
        // var index = this.filter.selectedFeatures_notactive.findIndex(x => x === "sec");
        // if (index) {
        //   this.filter.selectedFeatures_notactive.splice(index, 1);
        // }
      } else if (element == "home") {
        this.filter.homeServicesEnabled = true;
        this.filter.homeServicesEnabled_notactive = false;
      } else if (element == "sub") {
        this.filter.subscriptionEnabled = true;
        this.filter.subscriptionEnabled_notactive = false;
      } else if (element == "enabled") {
        this.filter.enabled = true;
        this.filter.enabled_notactive = false;
      }
    });
    this.listAllProjects();
  }

  filterProjectsNotStatus(evt) {
    this.filter.securityEnabled_notactive = false;
    this.filter.subscriptionEnabled_notactive = false;
    this.filter.homeServicesEnabled_notactive = false;
    this.filter.enabled_notactive = false;

    evt.value.forEach(element => {
      if (element == "sec") {
        this.filter.securityEnabled_notactive = true;
        this.filter.securityEnabled = false;
        var index = this.filter.selectedFeatures.findIndex(x => x === "sec");
        if (index > -1) {
          this.filter.selectedFeatures.splice(index, 1);
        }
      } else if (element == "home") {
        this.filter.homeServicesEnabled_notactive = true;
        this.filter.homeServicesEnabled = false;
      } else if (element == "sub") {
        this.filter.subscriptionEnabled_notactive = true;
        this.filter.subscriptionEnabled = false;
      } else if (element == "enabled") {
        this.filter.enabled_notactive = true;
        this.filter.enabled = false;
      }
    });
    this.listAllProjects();
  }

  openUpdateDialog(project): void {
    const dialogRef = this.dialog.open(ProjectsAddModalComponent, {
      width: "700px",
      disableClose: true,
      autoFocus: true,
      data: {
        project: project,
        permission: "notjustView"
      }
    });
    dialogRef.afterClosed().subscribe(fetchedData => {
      if (fetchedData) {
        this.listAllProjects();
      }
    });
  }

  openUpdateDialogForView(project): void {
    const dialogRef = this.dialog.open(ProjectsAddModalComponent, {
      width: "700px",
      disableClose: true,
      autoFocus: true,
      data: {
        project: project,
        permission: "justView"
      }
    });
    dialogRef.afterClosed().subscribe(fetchedData => {
      if (fetchedData) {
        this.listAllProjects();
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ProjectsAddModalComponent, {
      width: "700px",
      disableClose: true,
      autoFocus: true,
      data: { permission: "add", project: {} }
    });
    dialogRef.afterClosed().subscribe(fetchedData => {
      if (fetchedData) {
        this.listAllProjects();
      }
    });
  }

  pagination(type) {
    if (type == "next") {
      if (this.filter.page + 1 <= this.totalPages) {
        this.filter.page += 1;
        this.listAllProjects();
      }
    } else if (type == "back") {
      if (this.filter.page - 1 > -1) {
        this.filter.page -= 1;
        this.listAllProjects();
      }
    } else if (type == "last") {
      this.filter.page = this.totalPages - 1;
      this.listAllProjects();
    } else if (type == "first") {
      this.filter.page = 0;
      this.listAllProjects();
    }
  }

  onPageChange(size) {
    if (this.filter.size != size) {
      this.filter.size = Number(size);
      this.filter.page = 0;
      this.listAllProjects();
    }
  }

  resetFilter() {
    this.filter = {
      securityEnabled: false,
      subscriptionEnabled: false,
      homeServicesEnabled: false,
      enabled: false,
      securityEnabled_notactive: false,
      subscriptionEnabled_notactive: false,
      homeServicesEnabled_notactive: false,
      enabled_notactive: false,
      page: 0,
      size: 20,
      selectedFeatures: [],
      selectedFeatures_notactive: []
    };
    this.listAllProjects();
  }

  export() {
    var table = document.getElementById("projects-table");
    var tempTable: any = table.cloneNode(true);
    var cellIndex = tempTable.rows[0].cells.length;
    for (var i = 0; i < tempTable.rows.length; i++) {
      tempTable.rows[i].deleteCell(cellIndex - 1);
    }
    TableUtil.exportToExcel(tempTable, "Projects");
  }
}
