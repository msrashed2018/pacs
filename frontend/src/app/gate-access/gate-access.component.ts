import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { GateAccessService } from "../services/gate-access.service";
import { SubscriptionService } from "app/services/subscription.service";
import { TableUtil } from "app/models/TableUtil";
import { ConfigClass, EditPrivilege, ViewPrivilege } from "../config";
import { Router } from "@angular/router";

@Component({
  selector: "app-gate-access",
  templateUrl: "./gate-access.component.html",
  styleUrls: ["./gate-access.component.css"]
})
export class GateAccessComponent implements OnInit {
  displayedColumns: string[] = [
    "projectName",
    "unitNumber",
    "userName",
    "guestName",
    "numberOfGuests",
    "carType",
    "plateNumber",
    "accessDate",
    "status"
  ];
  dataSource;
  totalPages = 0;
  distinctProjectsName;
  page = 0;
  size = 20;
  filters = {
    userName: "",
    projectId: "",
    unitNumber: "",
    guestName: "",
    fromDate: "",
    toDate: "",
    page: 0,
    size: 20,
    status: "",
    projects: [],
    statusArr: []
  };
  gateAccesses;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  accessStatus: any = [
    { id: "ACCESSED", name: "Accessed" },
    { id: "SCHEDULED", name: "Scheduled" }
  ];

  constructor(
    public dialog: MatDialog,
    private GateAccessService: GateAccessService,
    private subscriptionService: SubscriptionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllProjects();
    this.getData();
    this.checkPrivilage();
  }

  checkPrivilage() {
    if (ConfigClass.getPrivilageStatus) {
      let willShow = false;
      let privilage = JSON.parse(sessionStorage.getItem("privilage"));
      privilage.forEach(element => {
        if (element.name == EditPrivilege.GATE_ACCESS_EDIT) {
          this.displayedColumns.push();
          willShow = true;
        } else {
          if (element.name == ViewPrivilege.GATE_ACCESS + "_VIEW") {
            willShow = true;
          }
        }
      });
      if (!willShow) {
        this.router.navigate(["dashboard"]);
      }
    } else {
      this.displayedColumns.push();
    }
  }

  restFilters() {
    this.filters = {
      userName: "",
      projectId: "",
      unitNumber: "",
      guestName: "",
      fromDate: "",
      toDate: "",
      page: 0,
      size: 20,
      status: "",
      projects: [],
      statusArr: []
    };
    this.getData();
  }

  getAllProjects() {
    this.subscriptionService.getAllProjects().subscribe(result => {
      this.distinctProjectsName = result.content;
    });
  }

  export() {
    TableUtil.exportToExcel(
      document.getElementById("gateAccess-table"),
      "Gate Access"
    );
  }

  getData() {
    if (this.filters.fromDate && this.filters.toDate) {
      var date = new Date(this.filters.fromDate);
      let month = date.getMonth() + 1;
      let day = date.getDate();
      this.filters.fromDate =
        date.getFullYear() +
        "-" +
        (month.toString().length > 1 ? month : "0" + month) +
        "-" +
        (day.toString().length > 1 ? day : "0" + day);

      var date2 = new Date(this.filters.toDate);
      let month2 = date2.getMonth() + 1;
      let day2 = date2.getDate();
      this.filters.toDate =
        date2.getFullYear() +
        "-" +
        (month2.toString().length > 1 ? month2 : "0" + month2) +
        "-" +
        (day2.toString().length > 1 ? day2 : "0" + day2);
    }

    this.filters.projectId = "";
    this.filters.projects.forEach(element => {
      this.filters.projectId += "&projectId=" + element;
    });

    this.filters.status = "";
    if (
      this.filters.statusArr.length == 2 ||
      this.filters.statusArr.length == 0
    ) {
      this.filters.status = "";
    } else {
      this.filters.status = this.filters.statusArr[0];
    }

    this.GateAccessService.GetAll(this.page, this.size, this.filters).subscribe(
      results => {
        this.gateAccesses = results["content"];
        this.dataSource = new MatTableDataSource(this.gateAccesses);
        this.totalPages = results["totalPages"];
      }
    );
  }

  pagination(type) {
    if (type == "next") {
      if (this.filters.page + 1 <= this.totalPages) {
        this.filters.page += 1;
        this.getData();
      }
    } else if (type == "back") {
      if (this.filters.page - 1 > -1) {
        this.filters.page -= 1;
        this.getData();
      }
    } else if (type == "last") {
      this.filters.page = this.totalPages - 1;
      this.getData();
    } else if (type == "first") {
      this.filters.page = 0;
      this.getData();
    }
  }

  onPageChange(size) {
    if (this.size != size) {
      this.size = Number(size);
      this.filters.page = 0;
      this.getData();
    }
  }
}
