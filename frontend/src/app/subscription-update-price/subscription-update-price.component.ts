import { Component, OnInit, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubscriptionService } from 'app/services/subscription.service';
import { Globals } from "../globals";
import { ProperityService } from '../services/properity.service';

@Component({
  selector: 'app-subscription-update-price',
  templateUrl: './subscription-update-price.component.html',
  styleUrls: ['./subscription-update-price.component.css']
})
export class SubscriptionUpdatePriceComponent implements OnInit {

  subscription: any = {};
  cars: any = [];
  sendNotification: boolean = false;
  message: string = "";

  constructor(
    public dialogRef: MatDialogRef<SubscriptionUpdatePriceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private subscriptionService: SubscriptionService, private globals: Globals, private properityService: ProperityService) {
    this.subscription = data.subscription;

    if ((this.subscription.moreDetailsType == "GARDEN_AREA" || this.subscription.moreDetailsType == "SP_AREA") && this.subscription.moreDetails != "") {
      var jsonData = JSON.parse(this.subscription.moreDetails);
      this.subscription.totalArea = jsonData[0].area;
    }
    else if (this.subscription.moreDetailsType == "CAR_DETAIL") {
      this.cars = JSON.parse(this.subscription.moreDetails);
    }
  }

  ngOnInit() {
  }

  onClickCancel(): void {
    this.dialogRef.close();
  }

  send() {
    if (this.message.length > 255) {
      this.globals.presentErrorToast("Message can be max 255 characters");
      return false;
    }
    var data =
    {
      "message": this.message,
      "title": "Property Verification",
      "topic": "Property Verification"
    }
    this.properityService.sendMessage(this.subscription.userId, data).subscribe(result => {
      this.dialogRef.close();
      this.globals.presentSuccessToast("Message sent successfully")
    });
  }
}

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}