import { Component, OnInit, ViewChild } from "@angular/core";
import { CustomizedServices } from "../services/customizedservice.service";
import { SubscribtionsCatgServiceService } from "../services/subscribtions-catg-service.service";
import { ServiceItemModel, ServiceTypeModel } from "../models/ServiceTypeModel";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { SubscribtionCatgsItemsAddModalComponent } from "../subscribtion-catgs-items-add-modal/subscribtion-catgs-items-add-modal.component";
import { EventEmitterService } from "../event-emitter.service";
import { ConfirmationComponent } from "../confirmation/confirmation.component";
import { ConfigClass, EditPrivilege, ViewPrivilege } from '../config';
import { Router } from "@angular/router";

@Component({
  selector: "app-subscription-catg",
  templateUrl: "./subscription-catg.component.html",
  styleUrls: ["./subscription-catg.component.css"]
})
export class SubscriptionCatgComponent implements OnInit {
  selected = -1;
  subscribtionsTypes: ServiceTypeModel[] = [];
  subscribtionsItems: ServiceItemModel[];
  displayedColumns: string[] = [
    "subscribtionCatalogDescription",
    "subscribtionCatalogDescriptionAr",
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
    private SubscribtionsCatgServiceService: SubscribtionsCatgServiceService,
    public dialog: MatDialog,
    private eventEmitterService: EventEmitterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.SubscribtionsCatgServiceService.GetAllSubscribtionCatgTypes().subscribe(
      results => {
        this.subscribtionsTypes.push(results["content"]);
        this.selected = results["content"][1].id;
        this.getData();
      }
    );
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
        if (element.name == EditPrivilege.SUBSCRIPTION_CATEGORY_EDIT) {
          this.displayedColumns.push("update");
          this.displayedColumns.push("delete");
          this.showAddBtn = true;
          willShow = true;
        }
        else {
          if (element.name == ViewPrivilege.SUBSCRIPTION_CATEGORY + "_VIEW") {
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
    this.SubscribtionsCatgServiceService.GetSubscribtionCatgItems(
      serviceTypeid,
      this.page,
      this.size
    ).subscribe(results => {
      this.dataSource = "";
      this.subscribtionsItems = results["content"];
      this.totalPages = results["totalPages"];
      this.dataSource = new MatTableDataSource<ServiceItemModel>(
        this.subscribtionsItems
      );
    });
  }

  getData() {
    this.getServiceTypeItems(this.selected);
  }

  disableOrEnableItem(type, item) {
    var dataObj = {
      description: item.description,
      descriptionAr: item.descriptionAr,
      price: item.price,
      type: {
        id: this.selected
      },
      period: item.period,
      priceNote: item.priceNote,
      priceNoteAr: item.priceNoteAr,
      enabled: type == "disable" ? false : true
    };

    this.SubscribtionsCatgServiceService.UpdateItem(item.id, dataObj).subscribe(
      res => this.getData()
    );
  }

  openAddUpdateDialog(ItemId?): void {
    const dialogRef = this.dialog.open(
      SubscribtionCatgsItemsAddModalComponent,
      {
        width: "700px",
        disableClose: true,
        autoFocus: true,
        data: {
          TypeId: this.selected,
          ItemId: ItemId
        }
      }
    );
    dialogRef.afterClosed().subscribe(fetchedData => {
      if (fetchedData) {
        this.getData();
      }
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

  // openDeleteDialog(item) {
  //   const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
  //     width: "350px",
  //     disableClose: false,
  //     autoFocus: false
  //   });
  //   dialogRef.afterClosed().subscribe(fetchedData => {
  //     if (fetchedData) {
  //       this.disableItem(item);
  //     }
  //   });
  // }

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
}
