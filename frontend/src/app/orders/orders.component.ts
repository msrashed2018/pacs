import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { OrderModel } from '../models/OrderModel';
import { OrderService } from '../services/order.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OrdersAddModalComponent } from '../orders-add-modal/orders-add-modal.component';
import { EventEmitterService } from '../event-emitter.service';
import { ProjectsModel } from '../models/ProjectsModel';
import { ProjectService } from '../services/project.service';
import { TableUtil } from '../models/TableUtil';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CustomizedServices } from "../services/customizedservice.service";
import { SubscriptionService } from "../services/subscription.service";
import { ConfigClass, EditPrivilege, ViewPrivilege } from '../config';
import { Router } from '@angular/router';


@Component({
  selector: 'app-table-list',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orders: OrderModel[];
  ordersDetails: OrderModel[];
  projects: ProjectsModel[] = [];
  pendingCancelleddisplayedColumns: string[] = ['ID', 'Project', 'PropertyNumber', 'UserName', 'ServiceTypeName', 'TargetDate', 'UserMobile', 'TotalPrice'];
  assignedCompleteddisplayedColumns: string[] = ['ID', 'Project', 'PropertyNumber', 'UserName', 'ServiceTypeName', 'TargetDate', 'TechnicianName', 'TotalPrice'];
  ordersDataSource
  myTargetDate;
  resetDate;
  tabIndex = 0;
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
    serviceTypes: [],
  };
  servicesArr: any = [];

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  constructor(private orderService: OrderService, private dialog: MatDialog, private eventEmitterService: EventEmitterService, private projectService: ProjectService,
    private customizedService: CustomizedServices, private subscriptionService: SubscriptionService, private router: Router
  ) {
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
        if (element.name == EditPrivilege.ORDERS_EDIT) {
          this.pendingCancelleddisplayedColumns.push("Verify");
          willShow = true;
        }
        else {
          if (element.name == ViewPrivilege.ORDERS + "_VIEW") {
            willShow = true;
          }
        }
      });
      if (!willShow) {
        this.router.navigate(["dashboard"]);
      }
    } else {
      this.pendingCancelleddisplayedColumns.push("Verify");
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

    this.orderService.GetAllOrders(this.filters).subscribe(res => {
      this.orders = res['content'];
      this.ordersDetails = res['content'];
      this.ordersDataSource = new MatTableDataSource<OrderModel>(res['content']);
      this.totalPages = res.totalPages
    });
  }

  getSubscribtionTypes() {
    this.customizedService.GetAllServiceTypes().subscribe(result => {
      this.servicesArr = result;
    });
  }

  openUpdateDialog(CurrentOrderId, orderStatus): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '700px';

    dialogConfig.data = {
      orderDetails: this.ordersDetails.filter(({ orderId }) => orderId === CurrentOrderId),
      orderId: CurrentOrderId,
      status: orderStatus
    };

    const dialogRef = this.dialog.open(OrdersAddModalComponent, dialogConfig);
  }

  restAllFilters(status = "PENDING") {
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
    var tableName = "";
    switch (this.tabIndex) {
      case 0:
        tableName = "pendingTable";
        break;
      case 1:
        tableName = "assignTable";
        break;
      case 2:
        tableName = "doneTable";
        break;
      case 3:
        tableName = "cancelledTable";
        break;
    }
    var table = document.getElementById(tableName);
    var tempTable: any = table.cloneNode(true);;
    var cellIndex = tempTable.rows[0].cells.length;
    for (var i = 0; i < tempTable.rows.length; i++) {
      tempTable.rows[i].deleteCell(cellIndex - 1);
    }
    TableUtil.exportToExcel(tempTable, "Orders");
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this.tabIndex = tabChangeEvent.index;
    switch (this.tabIndex) {
      case 0:
        this.filters.status = "PENDING";
        break;
      case 1:
        this.filters.status = "ASSIGNED";
        break;
      case 2:
        this.filters.status = "DONE";
        break;
      case 3:
        this.filters.status = "CANCELLED";
        break;
    }
    this.restAllFilters(this.filters.status);
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

