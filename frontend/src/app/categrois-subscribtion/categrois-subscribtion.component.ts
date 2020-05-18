import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { CategroisSubscribtionAddComponent } from "../categrois-subscribtion-add/categrois-subscribtion-add.component";
import { EditPrivilege, ConfigClass, ViewPrivilege } from "../config";
import { ConfirmationComponent } from "../confirmation/confirmation.component";
import { ServiceTypeModel } from "../models/ServiceTypeModel";
import { SubscribtionsCatgServiceService } from "../services/subscribtions-catg-service.service";

@Component({
  selector: "app-categrois-subscribtion",
  templateUrl: "./categrois-subscribtion.component.html",
  styleUrls: ["./categrois-subscribtion.component.css"]
})
export class CategroisSubscribtionComponent implements OnInit {
  selected = -1;
  subscribtionsTypes: ServiceTypeModel[] = [];
  displayedColumns: string[] = [
    "name",
    "nameAr",
    "viewOrder",
    "description",
    "descriptionAr",
    "icon",
    "enabled"
  ];

  dataSource;
  totalPages = 0;
  page = 0;
  size = 20;
  showAddBtn = false;
  totalItems = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private SubscribtionsCatgServiceService: SubscribtionsCatgServiceService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getSubTypes();
    this.checkPrivilage();
  }

  checkPrivilage() {
    if (ConfigClass.getPrivilageStatus) {
      let willShow = false;
      let privilage = JSON.parse(localStorage.getItem("privilage"));
      privilage.forEach(element => {
        if (element.name == EditPrivilege.SUBSCRIPTION_CATEGORY_EDIT) {
          this.displayedColumns.push("update");
          this.displayedColumns.push("delete");
          this.showAddBtn = true;
          willShow = true;
        } else {
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

  getSubTypes() {
    this.SubscribtionsCatgServiceService.GetAllSubscribtionCatgTypes().subscribe(
      results => {
        this.subscribtionsTypes = results["content"];
        this.dataSource = new MatTableDataSource(this.subscribtionsTypes);
        this.totalItems = results["totalElements"];
        this.totalPages = results["totalPages"];
      }
    );
  }

  disableOrEnableItem(type, item) {
    var dataObj = {
      name: item.name,
      nameAr: item.nameAr,
      description: item.description,
      descriptionAr: item.descriptionAr,
      icon: item.icon,
      viewOrder: item.viewOrder,
      enabled: type == "disable" ? false : true
    };

    this.SubscribtionsCatgServiceService.UpdateCatgItem(
      item.id,
      dataObj
    ).subscribe(res => this.getSubTypes());
  }

  openAddUpdateDialog(Item?): void {
    const dialogRef = this.dialog.open(CategroisSubscribtionAddComponent, {
      width: "700px",
      disableClose: true,
      autoFocus: true,
      data: {
        Item: Item,
        totalItems: this.totalItems
      }
    });
    dialogRef.afterClosed().subscribe(fetchedData => {
      if (fetchedData) {
        this.getSubTypes();
      }
    });
  }

  pagination(type) {
    if (type == "next") {
      if (this.page + 1 <= this.totalPages) {
        this.page += 1;
        this.getSubTypes();
      }
    } else if (type == "back") {
      if (this.page - 1 > -1) {
        this.page -= 1;
        this.getSubTypes();
      }
    } else if (type == "last") {
      this.page = this.totalPages - 1;
      this.getSubTypes();
    } else if (type == "first") {
      this.page = 0;
      this.getSubTypes();
    }
  }

  onPageChange(size) {
    if (this.size != size) {
      this.size = Number(size);
      this.page = 0;
      this.getSubTypes();
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
