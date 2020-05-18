import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { OffersService } from "../services/offers.service";
import { TableUtil } from "app/models/TableUtil";
import { DeleteConfirmationComponent } from "app/delete-confirmation/delete-confirmation.component";
import { OffersModalComponent } from "../offers-modal/offers-modal.component";
import { DatePipe } from "@angular/common";
import { ConfigClass, EditPrivilege, ViewPrivilege } from "../config";
import { Router } from "@angular/router";

@Component({
  selector: "app-offers.component",
  templateUrl: "./offers.component.html",
  styleUrls: ["./offers.component.css"]
})
export class OffersComponent implements OnInit {
  offers: OffersService[];
  showAddBtn = false;

  totalPages = 0;
  filters = {
    page: 0,
    size: 20,
    category: "",
    merchant: "",
    title: "",
    startDate: "",
    endDate: ""
  };

  exportDisplayedColumns = [
    "ID",
    "Category",
    "Merchant",
    "Title",
    "StartDate",
    "EndDate"
  ];

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  constructor(
    private offersService: OffersService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.listAllOffers();
    this.checkPrivilage();
  }

  checkPrivilage() {
    if (ConfigClass.getPrivilageStatus) {
      let willShow = false;
      let privilage = JSON.parse(sessionStorage.getItem("privilage"));
      privilage.forEach(element => {
        if (element.name == EditPrivilege.OFFERS_EDIT) {
          this.exportDisplayedColumns.push("Verify");
          this.showAddBtn = true;
          willShow = true;
        } else {
          if (element.name == ViewPrivilege.OFFERS + "_VIEW") {
            willShow = true;
          }
        }
      });
      if (!willShow) {
        this.router.navigate(["dashboard"]);
      }
    } else {
      this.exportDisplayedColumns.push("Verify");
      this.showAddBtn = true;
    }
  }

  listAllOffers() {
    var datePipe = new DatePipe("en");
    if (this.filters.startDate) {
      this.filters.startDate = datePipe.transform(
        this.filters.startDate,
        "yyyy-MM-dd"
      );
    }
    if (this.filters.endDate) {
      this.filters.endDate = datePipe.transform(
        this.filters.endDate,
        "yyyy-MM-dd"
      );
    }

    this.offersService.GetAllOffers(this.filters).subscribe(res => {
      this.offers = res["content"];

      this.offers.forEach((element: any) => {
        element.startDate = datePipe.transform(
          element.startDate,
          "yyyy-MM-dd HH:mm:ss"
        );
        element.endDate = datePipe.transform(
          element.endDate,
          "yyyy-MM-dd HH:mm:ss"
        );
      });
      this.totalPages = res.totalPages;
    });
  }

  AddDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "700px";

    dialogConfig.data = {
      offerDetails: {
        category: "",
        categoryAr: "",
        description: "",
        descriptionAr: "",
        endDate: "",
        id: null,
        primaryImage: "",
        startDate: "",
        termsAndConditions: "",
        title: "",
        titleAr: "",
        websiteUrl: "",
        websiteUrlAr: "",
        images: [],
        location: "",
        locationAr: "",
        merchant: "",
        merchantAr: ""
      },
      isAdd: true
    };

    const dialogRef = this.dialog.open(OffersModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(fetchedData => {
      if (fetchedData) {
        this.listAllOffers();
      }
    });
  }

  openUpdateDialog(obj): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "700px";

    dialogConfig.data = {
      offerDetails: obj,
      isUpdate: true
    };

    const dialogRef = this.dialog.open(OffersModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(fetchedData => {
      if (fetchedData) {
        this.listAllOffers();
      }
    });
  }

  openViewDialog(obj): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "700px";

    dialogConfig.data = {
      offerDetails: obj
    };

    const dialogRef = this.dialog.open(OffersModalComponent, dialogConfig);
  }

  openConfirmDialog(obj): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: "350px",
      disableClose: false,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(fetchedData => {
      if (fetchedData) {
        this.deleteOffer(obj);
      }
    });
  }

  deleteOffer(obj) {
    this.offersService.DeleteOffer(obj.id).subscribe(res => {
      this.listAllOffers();
    });
  }

  restAllFilters() {
    this.filters = {
      page: 0,
      size: 20,
      category: "",
      merchant: "",
      title: "",
      startDate: "",
      endDate: ""
    };
    this.listAllOffers();
  }

  export() {
    var datePipe = new DatePipe("en");

    this.offers.forEach((element: any) => {
      element.startDate = datePipe.transform(
        element.startDate,
        "yyyy-MM-dd HH:mm:ss"
      );
      element.endDate = datePipe.transform(
        element.endDate,
        "yyyy-MM-dd HH:mm:ss"
      );
    });
    var table = document.getElementById("offersTable");
    var tempTable: any = table.cloneNode(true);
    if (this.showAddBtn) {
      var cellIndex = tempTable.rows[0].cells.length;
      for (var i = 0; i < tempTable.rows.length; i++) {
        tempTable.rows[i].deleteCell(cellIndex - 1);
      }
    }
    TableUtil.exportToExcel(tempTable, "Offers");
  }

  pagination(type) {
    if (type == "next") {
      if (this.filters.page + 1 <= this.totalPages) {
        this.filters.page += 1;
        this.listAllOffers();
      }
    } else if (type == "back") {
      if (this.filters.page - 1 > -1) {
        this.filters.page -= 1;
        this.listAllOffers();
      }
    } else if (type == "last") {
      this.filters.page = this.totalPages - 1;
      this.listAllOffers();
    } else if (type == "first") {
      this.filters.page = 0;
      this.listAllOffers();
    }
  }

  onPageChange(size) {
    if (this.filters.size != size) {
      this.filters.size = Number(size);
      this.filters.page = 0;
      this.listAllOffers();
    }
  }
}
