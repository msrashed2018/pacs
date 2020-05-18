import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomizeOrdersService } from '../services/customize-order.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomizeOrdersAddModalComponent } from '../customize-orders-add-modal/customize-orders-add-modal.component';
import { ProjectsModel } from '../models/ProjectsModel';
import { ProjectService } from '../services/project.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TableUtil } from '../models/TableUtil';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CustomizedServices } from "../services/customizedservice.service";
import { SubscriptionService } from "../services/subscription.service";
import { CustomizeOrderModel } from '../models/CustomizeOrderModel';
import { ConfigClass, EditPrivilege, ViewPrivilege } from '../config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customize-orderst',
  templateUrl: './customize-orders.component.html',
  styleUrls: ['./customize-orders.component.css']
})
export class CustomizeOrdersComponent implements OnInit {

  orders: CustomizeOrderModel[];
  projects: ProjectsModel[] = [];
  pendingDisplayedColumns: string[] = ['ID', 'Project', 'PropertyNumber', 'OwnerName', 'ServiceTypeName', 'TargetDate', 'UserMobile', 'TotalPrice'];
  assignedDisplayedColumns: string[] = ['ID', 'Project', 'PropertyNumber', 'OwnerName', 'ServiceTypeName', 'TargetDate', 'TechnicianName', 'TotalPrice'];
  exportDisplayedColumns = [];
  myTargetDate;
  resetDate;
  totalPages = 0;

  filters = {
    fromDate: '',
    toDate: "",
    ownerName: '',
    unitNumber: '',
    projectId: '',
    page: 0,
    size: 20,
    serviceId: "",
    status: "PENDING",
    projects: [],
    serviceTypes: []
  };
  servicesArr: any = [];


  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  constructor(private customizeOrdersService: CustomizeOrdersService, private dialog: MatDialog, private projectService: ProjectService,
    private customizedService: CustomizedServices, private subscriptionService: SubscriptionService, private router: Router
  ) {
    this.exportDisplayedColumns = this.pendingDisplayedColumns;
  }

  ngOnInit() {
    this.listAllOrders();
    this.listAllProjects();
    this.getSubscribtionTypes();
    this.checkPrivilage();
  }

  checkPrivilage() {
    if (ConfigClass.getPrivilageStatus) {
      let willShow = false;
      let privilage = JSON.parse(sessionStorage.getItem("privilage"));
      privilage.forEach(element => {
        if (element.name == EditPrivilege.CUSTOMIZED_ORDERS_EDIT) {
          this.exportDisplayedColumns.push("Verify");
          willShow = true;
        }
        else {
          if (element.name == ViewPrivilege.CUSTOMIZED_ORDERS + "_VIEW") {
            willShow = true;
          }
        }
      });
      if (!willShow) {
        this.router.navigate(["dashboard"]);
      }
    } else {
      this.exportDisplayedColumns.push("Verify");
    }
  }

  listAllOrders() {
    if (this.filters.fromDate && this.filters.toDate) {
      var date = new Date(this.filters.fromDate);
      let month = date.getMonth() + 1;
      let day = date.getDate();
      this.filters.fromDate = date.getFullYear() + "-" + (month.toString().length > 1 ? month : "0" + month) + "-" + (day.toString().length > 1 ? day : "0" + day);

      var date2 = new Date(this.filters.toDate);
      let month2 = date2.getMonth() + 1;
      let day2 = date2.getDate();
      this.filters.toDate = date2.getFullYear() + "-" + (month2.toString().length > 1 ? month2 : "0" + month2) + "-" + (day2.toString().length > 1 ? day2 : "0" + day2);
    }

    this.filters.projectId = "";
    this.filters.projects.forEach(element => {
      this.filters.projectId += "&projectId=" + element;
    });

    this.filters.serviceId = "";
    this.filters.serviceTypes.forEach(element => {
      this.filters.serviceId += "&serviceTypeId=" + element;
    });

    this.customizeOrdersService.GetAllOrders(this.filters).subscribe(res => {
      this.orders = res['content'];
      this.totalPages = res.totalPages
    });
  }

  getSubscribtionTypes() {
    this.customizedService.GetAllServiceTypes().subscribe(result => {
      this.servicesArr = result;
    });
  }

  openUpdateDialog(obj): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '700px';

    dialogConfig.data = {
      orderDetails: obj,
    };

    const dialogRef = this.dialog.open(CustomizeOrdersAddModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(fetchedData => {
      if (fetchedData) {
        this.listAllOrders();
      }
    });
  }

  restAllFilters() {
    let status = this.filters.status;
    this.filters = {
      fromDate: '',
      toDate: "",
      ownerName: '',
      unitNumber: '',
      projectId: '',
      page: 0,
      size: 20,
      serviceId: "",
      status: status,
      projects: [],
      serviceTypes: []
    };
    this.listAllOrders();
  }

  listAllProjects() {
    this.subscriptionService.getAllProjects().subscribe(result => {
      this.projects = result.content;
    });
  }

  export() {

    var table = document.getElementById("orderTable");
    var tempTable: any = table.cloneNode(true);;
    var cellIndex = tempTable.rows[0].cells.length;
    for (var i = 0; i < tempTable.rows.length; i++) {
      tempTable.rows[i].deleteCell(cellIndex - 1);
    }

    TableUtil.exportToExcel(tempTable, "Customized_Orders");
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    switch (tabChangeEvent.index) {
      case 0:
        this.filters.status = "PENDING";
        this.exportDisplayedColumns = this.pendingDisplayedColumns;
        break;
      case 1:
        this.filters.status = "ASSIGNED";
        this.exportDisplayedColumns = this.assignedDisplayedColumns;
        break;
      case 2:
        this.filters.status = "DONE";
        this.exportDisplayedColumns = this.assignedDisplayedColumns;
        break;
      case 3:
        this.filters.status = "CANCELLED";
        this.exportDisplayedColumns = this.pendingDisplayedColumns;
        break;
    }
    this.restAllFilters();
  }

  pagination(type) {
    if (type == "next") {
      if (this.filters.page + 1 <= this.totalPages) {
        this.filters.page += 1;
        this.listAllOrders();
      }
    } else if (type == "back") {
      if (this.filters.page - 1 > -1) {
        this.filters.page -= 1;
        this.listAllOrders();
      }
    } else if (type == "last") {
      this.filters.page = this.totalPages - 1;
      this.listAllOrders();
    } else if (type == "first") {
      this.filters.page = 0;
      this.listAllOrders();
    }
  }

  onPageChange(size) {
    if (this.filters.size != size) {
      this.filters.size = Number(size);
      this.filters.page = 0;
      this.listAllOrders();
    }
  }
}

