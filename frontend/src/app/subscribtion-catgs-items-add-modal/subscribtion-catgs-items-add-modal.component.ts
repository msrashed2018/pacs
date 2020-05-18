import { Component, Inject, OnInit } from "@angular/core";
import { ServiceTypeModel } from "../models/ServiceTypeModel";
import { CustomizedServices } from "../services/customizedservice.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { EventEmitterService } from "../event-emitter.service";
import { SubscribtionsCatgServiceService } from "../services/subscribtions-catg-service.service";

@Component({
  selector: "app-subscribtion-catgs-items-add-modal",
  templateUrl: "./subscribtion-catgs-items-add-modal.component.html",
  styleUrls: ["./subscribtion-catgs-items-add-modal.component.css"]
})
export class SubscribtionCatgsItemsAddModalComponent implements OnInit {
  servicesTypes: ServiceTypeModel[] = [];
  selected;
  dataObj = {
    description: "",
    descriptionAr: "",
    price: "",
    type: {
      id: this.selected
    },
    period: 1,
    priceNote: "",
    priceNoteAr: "",
    enabled: true
  };
  ItemId;
  showButtons: boolean = false;
  createdBy;
  createdDate;
  modifiedBy;
  modifiedDate;
  constructor(
    private customizedService: CustomizedServices,
    private SubscribtionsCatgServiceService: SubscribtionsCatgServiceService,
    public dialogRef: MatDialogRef<SubscribtionCatgsItemsAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit(): void {
    this.SubscribtionsCatgServiceService.GetAllSubscribtionCatgTypes().subscribe(
      results => this.servicesTypes.push(results["content"])
    );
    if (this.data && this.data.TypeId && !this.data.ItemId) {
      this.selected = this.data.TypeId;
      this.dataObj.type.id = this.data.TypeId;
      this.showButtons = true;
    } else {
      this.SubscribtionsCatgServiceService.GetSubscribtionCatgItemsbyId(
        this.data.ItemId
      ).subscribe(res => {
        this.dataObj.type.id = this.data.TypeId;
        this.ItemId = res["id"];
        this.dataObj.price = res["price"].toString();
        this.dataObj.descriptionAr = res["descriptionAr"];
        this.dataObj.description = res["description"];
        this.dataObj.priceNote = res["priceNote"];
        this.dataObj.priceNoteAr = res["priceNoteAr"];
        this.dataObj.period = res["period"];
        this.createdBy = res["createdBy"];
        this.createdDate = res["createdDate"];
        this.modifiedBy = res["modifiedBy"];
        this.modifiedDate = res["modifiedDate"];
        this.showButtons = true;
        // console.log('RESULTS  ', res)
      });
    }
  }

  addTypeItem() {
    this.SubscribtionsCatgServiceService.AddItem(this.dataObj).subscribe(
      res => {
        this.eventEmitterService.onFirstComponentButtonClick();
        this.dialogRef.close(true);
      }
    );
  }

  updateServiceItem() {
    this.SubscribtionsCatgServiceService.UpdateItem(
      this.ItemId,
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
