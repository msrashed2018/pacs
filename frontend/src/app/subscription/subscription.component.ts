import { Component, OnInit, ViewChildren, QueryList } from "@angular/core";
import { SubscriptionService } from "app/services/subscription.service";
import { SubscriptionAdminModel } from "app/models/SubscriptionAdminModel";
import { MatDialog } from "@angular/material/dialog";
import { SubscriptionUpdatePriceComponent } from "app/subscription-update-price/subscription-update-price.component";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { TableUtil } from "app/models/TableUtil";
import { ConfigClass, EditPrivilege, ViewPrivilege } from "../config";
import { Router } from "@angular/router";
import { MatTabChangeEvent } from "@angular/material/tabs";

@Component({
  selector: "app-typography",
  templateUrl: "./subscription.component.html",
  styleUrls: ["./subscription.component.css"]
})
export class SubscriptionComponent implements OnInit {
  subscription: SubscriptionAdminModel = {};
  subscriptions: SubscriptionAdminModel[] = [];
  isChecked;
  filterBy: string;
  iconAllowUpdate: boolean = true;
  iconAllowSave: boolean = false;
  distinctProjectsName: any[] = [];
  dataSource;
  displayedColumns: string[] = [
    "id",
    "projectName",
    "buildingNumber",
    "ownerName",
    "serviceName",
    "requestDate",
    "fromDate",
    "toDate",
    "status"
  ];
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  totalPages = 0;
  filters = {
    ownerMobile: "",
    ownerName: "",
    projectId: "",
    unitNumber: "",
    fromDate: "",
    toDate: "",
    requestDate: "",
    page: 0,
    size: 20,
    serviceId: "",
    projects: [],
    serviceTypes: [],
    statusArr: [],
    status: "PENDING"
  };
  servicesArr: any = [];
  subscriptionStatus: any = [
    { id: "PENDING", name: "Pending" },
    { id: "SUBSCRIBED", name: "Subscribed" },
    { id: "EXPIRED", name: "Expired" },
    { id: "CANCELLED", name: "Cancelled" }
  ];

  constructor(
    private subscriptionService: SubscriptionService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  currentUpdatedPrice: number = -2222333;

  isAllowUpdateForPrice(id) {
    this.currentUpdatedPrice = id;
  }

  ngOnInit() {
    this.getAllProjects();
    this.listAllSubscriptions();
    this.getSubscribtionTypes();
    this.checkPrivilage();
  }

  checkPrivilage() {
    if (ConfigClass.getPrivilageStatus) {
      let willShow = false;
      let privilage = JSON.parse(sessionStorage.getItem("privilage"));
      privilage.forEach(element => {
        if (element.name == EditPrivilege.SUBSCRIPTION_EDIT) {
          this.displayedColumns.push("Action");
          willShow = true;
        } else {
          if (element.name == ViewPrivilege.SUBSCRIPTION + "_VIEW") {
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

  listAllSubscriptions() {
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

    if (!this.filters.toDate || !this.filters.fromDate) {
      if (this.filters.toDate) {
        this.filters.requestDate = this.filters.toDate;
        this.filters.toDate = "";
      } else {
        this.filters.requestDate = this.filters.fromDate;
        this.filters.fromDate = "";
      }
    }

    this.filters.projectId = "";
    this.filters.projects.forEach(element => {
      this.filters.projectId += "&projectId=" + element;
    });

    this.filters.serviceId = "";
    this.filters.serviceTypes.forEach(element => {
      this.filters.serviceId += "&typeId=" + element;
    });

    // this.filters.status = "";
    // this.filters.statusArr.forEach(element => {
    //   this.filters.status += "&status=" + element;
    // });
    // debugger;
    this.subscriptionService
      .Getsubscriptions(this.filters)
      .subscribe(outerContainsSubscriptions => {
        this.subscriptions = outerContainsSubscriptions
          ? outerContainsSubscriptions.content
          : null;
        this.dataSource = new MatTableDataSource<SubscriptionAdminModel>(
          this.subscriptions
        );
        this.totalPages = outerContainsSubscriptions.totalPages;
        this.subscriptions.forEach(element => {
          if (element.totalPrice) {
            element.alreadyHasPrice = true;
          }
        });
      });
  }

  getAllProjects() {
    this.subscriptionService.getAllProjects().subscribe(result => {
      this.distinctProjectsName = result.content;
    });
  }

  getSubscribtionTypes() {
    this.subscriptionService.getAllServices().subscribe(result => {
      this.servicesArr = result.content;
    });
  }

  openViewDialog(currentSubsc): void {
    const dialogRef = this.dialog.open(SubscriptionUpdatePriceComponent, {
      width: "700px",
      disableClose: true,
      autoFocus: true,
      data: {
        subscription: currentSubsc
      }
    });
    dialogRef.afterClosed().subscribe(fetchedData => {
      // this.listAllSubscriptions();
    });
  }

  resetFilter() {
    let status = this.filters.status;

    this.filters.page = 0;
    this.isChecked = false;
    this.filters.ownerMobile = "";
    this.filters.ownerName = "";
    this.filters.projectId = "";
    this.filters.unitNumber = "";
    this.filters.fromDate = "";
    this.filters.toDate = "";
    this.filters.requestDate = "";
    this.filters.serviceId = "";
    this.filters.projects = [];
    this.filters.serviceTypes = [];
    this.filters.statusArr = [];
    this.filters.status = status;
    this.listAllSubscriptions();
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    switch (tabChangeEvent.index) {
      case 0:
        this.filters.status = "PENDING";
        break;
      case 1:
        this.filters.status = "READY";
        break;
      case 2:
        this.filters.status = "SUBSCRIBED";
        break;
      case 3:
        this.filters.status = "EXPIRED";
        break;
      case 4:
        this.filters.status = "CANCELLED";
        break;
    }
    this.resetFilter();
  };

  filterByDropDownValues(proValue: SubscriptionAdminModel) {
    if (this.filterBy !== "all") {
      this.isChecked
        ? (this.dataSource = new MatTableDataSource<SubscriptionAdminModel>(
          this.subscriptions.filter(
            e => e[this.filterBy] === proValue[this.filterBy]
          )
        ))
        : this.listAllSubscriptions();
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  saveArea(subsObj) {
    var tempArr = [];
    tempArr.push({ area: subsObj.totalArea });
    var data = {
      moreDetails: JSON.stringify(tempArr),
      moreDetailsType:
        subsObj.item.type.serviceCode === "C002" ? "GARDEN_AREA" : "SP_AREA",
      subscriptionId: subsObj.subscriptionId
    };
    this.subscriptionService.UpdateSubscription(data).subscribe(a => {
      this.listAllSubscriptions();
    });
  }

  openUpdateDialog(obj): void {
    const dialogRef = this.dialog.open(SubscriptionUpdatePriceComponent, {
      width: "700px",
      data: { obj: obj }
    });
    dialogRef.afterClosed().subscribe(fetchedData => {
      this.listAllSubscriptions();
    });
  }

  export() {
    TableUtil.exportToExcel(
      document.getElementById("subscription-table"),
      "Subscriptions"
    );
  }

  pagination(type) {
    if (type == "next") {
      if (this.filters.page + 1 <= this.totalPages) {
        this.filters.page += 1;
        this.listAllSubscriptions();
      }
    } else if (type == "back") {
      if (this.filters.page - 1 > -1) {
        this.filters.page -= 1;
        this.listAllSubscriptions();
      }
    } else if (type == "last") {
      this.filters.page = this.totalPages - 1;
      this.listAllSubscriptions();
    } else if (type == "first") {
      this.filters.page = 0;
      this.listAllSubscriptions();
    }
  }

  onPageChange(size) {
    if (this.filters.size != size) {
      this.filters.size = Number(size);
      this.filters.page = 0;
      this.listAllSubscriptions();
    }
  }
}
