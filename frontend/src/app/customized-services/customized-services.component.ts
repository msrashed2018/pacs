import { Component, OnInit, ViewChild } from "@angular/core";
import { CustomizedServices } from "../services/customizedservice.service";
import { ServiceItemModel, ServiceTypeModel } from "../models/ServiceTypeModel";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { CustomizedServicesItemsAddModalComponent } from "../customized-services-items-add-modal/customized-services-items-add-modal.component";
import { EventEmitterService } from "../event-emitter.service";
import { DeleteConfirmationComponent } from "app/delete-confirmation/delete-confirmation.component";
import { ConfirmationComponent } from "../confirmation/confirmation.component";
import { ConfigClass, EditPrivilege, ViewPrivilege } from '../config';
import { Router } from "@angular/router";

@Component({
  selector: "app-customized-services",
  templateUrl: "./customized-services.component.html",
  styleUrls: ["./customized-services.component.css"]
})
export class CustomizedServicesComponent implements OnInit {
  selected = -1;
  servicesTypes: ServiceTypeModel[] = [];
  servicesItems: ServiceItemModel[];
  displayedColumns: string[] = [
    "serviceCatalogDescription",
    "serviceCatalogDescriptionAr",
    "price",
    "enabled",
  ];
  dataSource;
  totalPages = 0;
  page = 0;
  size = 20;
  showAddBtn = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private customizedService: CustomizedServices,
    public dialog: MatDialog,
    private eventEmitterService: EventEmitterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.customizedService.GetAllServiceTypes().subscribe(results => {
      this.servicesTypes.push(results);
      this.selected = results[0].id;
      this.getData();
    });
    if (this.eventEmitterService.subsVar == undefined) {
      this.eventEmitterService.subsVar = this.eventEmitterService.invokeFirstComponentFunction.subscribe(
        (name: string) => {
          this.getData();
        }
      );
    }
    this.checkPrivilage();
  }

  checkPrivilage() {
    if (ConfigClass.getPrivilageStatus) {
      let willShow = false;
      let privilage = JSON.parse(sessionStorage.getItem("privilage"));
      privilage.forEach(element => {
        if (element.name == EditPrivilege.SERVICE_EDIT) {
          this.displayedColumns.push("update");
          this.displayedColumns.push("delete");
          this.showAddBtn = true;
          willShow = true;
        }
        else {
          if (element.name == ViewPrivilege.SERVICE + "_VIEW") {
            willShow = true;
          }
        }
      });
      if (!willShow) {
        this.router.navigate(["dashboard"]);
      }
    } else {
      this.displayedColumns.push("update");
      this.displayedColumns.push("delete");
      this.showAddBtn = true;
    }
  }

  getServiceTypeItems(serviceTypeid) {
    this.customizedService
      .GetServiceItems(serviceTypeid, this.page, this.size)
      .subscribe(results => {
        this.servicesItems = results["content"];
        this.totalPages = results["totalPages"];
        this.dataSource = new MatTableDataSource<ServiceItemModel>(
          this.servicesItems
        );
      });
  }

  getData() {
    this.getServiceTypeItems(this.selected);
  }

  deleteServiceItem(serviceItemId) {
    this.customizedService
      .DeleteServiceItemById(this.selected, serviceItemId)
      .subscribe(res => this.getData());
  }

  openAddUpdateDialog(item?): void {
    const dialogRef = this.dialog.open(
      CustomizedServicesItemsAddModalComponent,
      {
        width: "700px",
        disableClose: true,
        autoFocus: true,
        data: {
          item: item
        }
      }
    );
    dialogRef.afterClosed().subscribe(fetchedData => {
      // this.getData();
    });
  }

  pagination(type) {
    if (type == "next") {
      if (this.page + 1 <= this.totalPages) {
        this.page += 1;
        this.getData();
      }
    } else if (type == "back") {
      if (this.page - 1 > -1) {
        this.page -= 1;
        this.getData();
      }
    } else if (type == "last") {
      this.page = this.totalPages - 1;
      this.getData();
    } else if (type == "first") {
      this.page = 0;
      this.getData();
    }
  }

  onPageChange(size) {
    if (this.size != size) {
      this.size = Number(size);
      this.page = 0;
      this.getData();
    }
  }

  openDeleteDialog(serviceId) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: "350px",
      disableClose: false,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(fetchedData => {
      if (fetchedData) {
        this.deleteServiceItem(serviceId);
      }
    });
  }

  openConfirmDialog(obj): void {
    let msg = "Are you sure to disable this Item?";
    if (!obj.enabled) {
      msg = "Are you sure to enable this Item?";
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: "350px",
      disableClose: false,
      autoFocus: false,
      data: { msg }
    });
    dialogRef.afterClosed().subscribe(fetchedData => {
      if (fetchedData) {
        if (obj.enabled) {
          this.disableOrEnableItem("disable", obj);
        } else {
          this.disableOrEnableItem("enable", obj);
        }
      }
    });
  }

  disableOrEnableItem(type, item) {
    debugger;
    item.enabled = type == "disable" ? false : true;

    this.customizedService
      .UpdateServiceTypeItem(this.selected, item.id, item)
      .subscribe(res => { });
  }
}
