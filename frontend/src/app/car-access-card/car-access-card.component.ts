import { Component, OnInit, ViewChildren, QueryList } from "@angular/core";
import { SubscriptionAdminModel } from "app/models/SubscriptionAdminModel";
import { MatDialog } from "@angular/material/dialog";
import { CarAccessCardAddSerialComponent } from "app/car-access-card-add-serial/car-access-card-add-serial.component";
import { AccessCardService } from "app/services/access-card.service";
import { AccessCardContentModel } from "app/models/AccessCardContentModel";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { TableUtil } from "app/models/TableUtil";
import { SubscriptionService } from "app/services/subscription.service";
import { DeleteConfirmationComponent } from "app/delete-confirmation/delete-confirmation.component";
import { ConfigClass, EditPrivilege, ViewPrivilege } from '../config';
import { Router } from '@angular/router';
@Component({
  selector: "app-car-access-card",
  templateUrl: "./car-access-card.component.html",
  styleUrls: ["./car-access-card.component.css"]
})
export class CarAccessCardComponent implements OnInit {
  filterBy: string;
  isChecked;
  dataSource;
  distinctProjectsName: any[] = [];
  displayedColumns: string[] = [
    "ProjectName",
    "propertyNumber",
    "OwnerName",
    "cardNumber1",
    "requestDate",
    "approvedBy",
    "approvedDate",
    "Status",
  ];
  accessCard: AccessCardContentModel = {};
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  accessCards: AccessCardContentModel[] = [];
  totalPages = 0;
  filters = {
    ownerName: "",
    projectId: "",
    unitNumber: "",
    cardNumber: "",
    page: 0,
    size: 20,
    fromDate: "",
    toDate: "",
    status: "",
    approvedDate: "",
    projects: [],
    statusArr: []
  };
  accessStatus: any = [
    { id: "PENDING", name: "Pending" },
    { id: "APPROVED", name: "Approved" }
  ];

  constructor(
    private accessCardService: AccessCardService,
    public dialog: MatDialog,
    private subscriptionService: SubscriptionService,
    private router: Router
  ) { }

  ngOnInit() {
    this.listAllAccessCards();
    this.getAllProjects();
    this.checkPrivilage();
  }

  checkPrivilage() {
    if (ConfigClass.getPrivilageStatus) {
      let willShow = false;
      let privilage = JSON.parse(sessionStorage.getItem("privilage"));
      privilage.forEach(element => {
        if (element.name == EditPrivilege.ACCESS_CARD_EDIT) {
          this.displayedColumns.push("Action");
          willShow = true;
        }
        else {
          if (element.name == ViewPrivilege.ACCESS_CARD + "_VIEW") {
            willShow = true;
          }
        }
      });
      if (!willShow) {
        this.router.navigate(["dashboard"]);
      }
    } else {
      this.displayedColumns.push("Action");
    }
  }

  getAllProjects() {
    this.subscriptionService.getAllProjects().subscribe(result => {
      this.distinctProjectsName = result.content;
    });
  }

  listAllAccessCards() {
    if (this.filters.fromDate && this.filters.toDate) {
      var date = new Date(this.filters.fromDate);
      var date2 = new Date(this.filters.toDate);
      if (date.getTime() === date2.getTime()) {
        let month = date.getMonth() + 1;
        let day = date.getDate();
        this.filters.approvedDate =
          date.getFullYear() +
          "-" +
          (month.toString().length > 1 ? month : "0" + month) +
          "-" +
          (day.toString().length > 1 ? day : "0" + day);
        this.filters.fromDate = this.filters.toDate = "";
      }
      else {
        let month = date.getMonth() + 1;
        let day = date.getDate();
        this.filters.fromDate =
          date.getFullYear() +
          "-" +
          (month.toString().length > 1 ? month : "0" + month) +
          "-" +
          (day.toString().length > 1 ? day : "0" + day);

        let month2 = date2.getMonth() + 1;
        let day2 = date2.getDate();
        this.filters.toDate =
          date2.getFullYear() +
          "-" +
          (month2.toString().length > 1 ? month2 : "0" + month2) +
          "-" +
          (day2.toString().length > 1 ? day2 : "0" + day2);
      }
    }

    this.filters.projectId = "";
    this.filters.projects.forEach(element => {
      this.filters.projectId += "&projectId=" + element;
    });

    this.filters.status = "";
    if (this.filters.statusArr.length == 2 || this.filters.statusArr.length == 0) {
      this.filters.status = "";
    }
    else { 
      this.filters.status = this.filters.statusArr[0];
    }

    this.accessCardService.GetAccessCards(this.filters).subscribe(card => {
      this.accessCards = card ? card.content : null;
      this.dataSource = new MatTableDataSource<AccessCardContentModel>(
        this.accessCards
      );
      this.totalPages = card.totalPages;
      if (this.filters.approvedDate != "") {
        this.filters.fromDate = this.filters.toDate = this.filters.approvedDate;
        this.filters.approvedDate = "";
      }
    });
  }

  resetFilter() {
    this.isChecked = false;
    this.filters.ownerName = "";
    this.filters.projectId = "";
    this.filters.unitNumber = "";
    this.filters.cardNumber = "";
    this.filters.fromDate = "";
    this.filters.toDate = "";
    this.filters.status = "";
    this.filters.approvedDate = "";
    this.filters.projects = [];
    this.filters.statusArr = [];
    this.listAllAccessCards();
  }

  filterByDropDownValues(proValue: AccessCardContentModel) {
    this.isChecked
      ? (this.dataSource = new MatTableDataSource<AccessCardContentModel>(
        this.accessCards.filter(
          e => e[this.filterBy] === proValue[this.filterBy]
        )
      ))
      : this.listAllAccessCards();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  openSerialOfAccessCardDialog(accessCardObj): void {
    const dialogRef = this.dialog.open(CarAccessCardAddSerialComponent, {
      width: "700px",
      disableClose: true,
      autoFocus: true,
      data: {
        accessCard: accessCardObj
      }
    });
    dialogRef.afterClosed().subscribe(fetchedData => {
      if (fetchedData) {
        this.listAllAccessCards();
      }
    });
  }

  openSerialOfAccessCardDialogView(accessCardObj): void {
    const dialogRef = this.dialog.open(CarAccessCardAddSerialComponent, {
      width: "700px",
      disableClose: true,
      autoFocus: true,
      data: {
        accessCard: accessCardObj,
        permission: "justView"
      }
    });
    dialogRef.afterClosed().subscribe(fetchedData => { });
  }

  filterByProjName(proValue: string) {
    this.isChecked
      ? (this.dataSource = new MatTableDataSource<AccessCardContentModel>(
        this.accessCards.filter(({ projectName }) => projectName === proValue)
      ))
      : this.listAllAccessCards();
  }

  deleteCard(cardId, ownerName) {
    if (confirm("Are you sure to delete card which for " + ownerName)) {
      this.accessCardService.DeleteAccessCard(cardId).subscribe(c => {
        this.listAllAccessCards();
      });
    }
  }

  export() {
    var table = document.getElementById("access-card-table");
    var tempTable: any = table.cloneNode(true);
    var cellIndex = tempTable.rows[0].cells.length;
    for (var i = 0; i < tempTable.rows.length; i++) {
      tempTable.rows[i].deleteCell(cellIndex - 1);
    }
    TableUtil.exportToExcel(tempTable, "Access_Cards");
  }

  pagination(type) {
    if (type == "next") {
      if (this.filters.page + 1 <= this.totalPages) {
        this.filters.page += 1;
        this.listAllAccessCards();
      }
    } else if (type == "back") {
      if (this.filters.page - 1 > -1) {
        this.filters.page -= 1;
        this.listAllAccessCards();
      }
    } else if (type == "last") {
      this.filters.page = this.totalPages - 1;
      this.listAllAccessCards();
    } else if (type == "first") {
      this.filters.page = 0;
      this.listAllAccessCards();
    }
  }

  onPageChange(size) {
    if (this.filters.size != size) {
      this.filters.size = Number(size);
      this.filters.page = 0;
      this.listAllAccessCards();
    }
  }

  openDeleteDialog(accessCardId, ownerName) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: "350px",
      disableClose: false,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(fetchedData => {
      if (fetchedData) {
        this.deleteCard(accessCardId, ownerName);
      }
    });
  }
}
