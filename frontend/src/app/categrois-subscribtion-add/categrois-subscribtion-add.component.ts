import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { EventEmitterService } from "../event-emitter.service";
import { ServiceTypeModel } from "../models/ServiceTypeModel";
import { CustomizedServices } from "../services/customizedservice.service";
import { SubscribtionsCatgServiceService } from "../services/subscribtions-catg-service.service";

@Component({
  selector: "app-categrois-subscribtion-add",
  templateUrl: "./categrois-subscribtion-add.component.html",
  styleUrls: ["./categrois-subscribtion-add.component.css"]
})
export class CategroisSubscribtionAddComponent implements OnInit {
  servicesTypes: ServiceTypeModel[] = [];
  selected;
  dataObj = {
    name: "",
    nameAr: "",
    description: "",
    descriptionAr: "",
    icon: "",
    viewOrder: "",
    enabled: true
  };
  ItemId;
  totalItems;
  showButtons = false;

  constructor(
    private SubscribtionsCatgServiceService: SubscribtionsCatgServiceService,
    public dialogRef: MatDialogRef<CategroisSubscribtionAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.Item.id) {
      this.dataObj["id"] = this.data.Item.id;
      this.showButtons = true;
    }
    this.dataObj.name = this.data.Item.name;
    this.dataObj.nameAr = this.data.Item.nameAr;
    this.dataObj.description = this.data.Item.description;
    this.dataObj.descriptionAr = this.data.Item.descriptionAr;
    this.dataObj.icon = this.data.Item.icon;
    this.dataObj.enabled = this.data.Item.enabled;
    this.dataObj.viewOrder = this.data.Item.viewOrder;
    this.totalItems = this.data.totalItems;
  }

  addItem() {
    debugger;
    this.dataObj.icon = this.dataObj.name.replace(/ /g, "-");
    this.SubscribtionsCatgServiceService.AddCatgItem(this.dataObj).subscribe(
      res => {
        this.eventEmitterService.onFirstComponentButtonClick();
        this.dialogRef.close(true);
      }
    );
  }

  updateItem() {
    this.SubscribtionsCatgServiceService.UpdateCatgItem(
      this.dataObj["id"],
      this.dataObj
    ).subscribe(res => {
      this.eventEmitterService.onFirstComponentButtonClick();
      this.dialogRef.close(true);
    });
  }

  onClickCancel(): void {
    this.dialogRef.close();
  }
}
