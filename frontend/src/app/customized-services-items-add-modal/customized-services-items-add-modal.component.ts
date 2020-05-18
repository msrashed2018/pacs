import { Component, Inject, OnInit } from "@angular/core";
import { ServiceTypeModel } from "../models/ServiceTypeModel";
import { CustomizedServices } from "../services/customizedservice.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { EventEmitterService } from "../event-emitter.service";

@Component({
  selector: "app-customized-services-items-add-modal",
  templateUrl: "./customized-services-items-add-modal.component.html",
  styleUrls: ["./customized-services-items-add-modal.component.css"]
})
export class CustomizedServicesItemsAddModalComponent implements OnInit {
  servicesTypes: ServiceTypeModel[] = [];
  selected;
  dataObj: any = {
    serviceCatalogDescription: "",
    serviceCatalogDescriptionAr: "",
    price: "",
    enabled: "true"
  };
  serviceTypeItemId;

  constructor(
    private customizedService: CustomizedServices,
    public dialogRef: MatDialogRef<CustomizedServicesItemsAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private eventEmitterService: EventEmitterService
  ) {}

  ctrl($scope) {
    $scope.pattern = /[\u0590-\u05FF]+/g;
  }

  ngOnInit(): void {
    this.customizedService
      .GetAllServiceTypes()
      .subscribe(results => this.servicesTypes.push(results));
    if (this.data && this.data.item) {
      this.serviceTypeItemId = this.data.item.id;
      this.dataObj = this.data.item;
      this.selected = this.dataObj.serviceType.id;
    }
  }

  addServiceTypeItem() {
    this.customizedService
      .AddServiceTypeItem(this.selected, this.dataObj)
      .subscribe(res => {
        this.eventEmitterService.onFirstComponentButtonClick();
        this.dialogRef.close();
      });
  }

  updateServiceItem() {
    this.customizedService
      .UpdateServiceTypeItem(this.selected, this.dataObj.id, this.dataObj)
      .subscribe(res => {
        this.eventEmitterService.onFirstComponentButtonClick();
        this.dialogRef.close();
      });
  }

  onClickCancel(): void {
    this.dialogRef.close();
  }
}
