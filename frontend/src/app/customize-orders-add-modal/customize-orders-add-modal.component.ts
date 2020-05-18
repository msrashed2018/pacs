import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomizeOrdersService } from '../services/customize-order.service';
import { CustomizeOrderModel } from '../models/CustomizeOrderModel';
import { DomSanitizer } from '@angular/platform-browser';
import { ProperityService } from '../services/properity.service';
import { Globals } from "../globals";

@Component({
    selector: 'app-customize-orders-add-modal',
    templateUrl: './customize-orders-add-modal.component.html',
    styleUrls: ['./customize-orders-add-modal.component.css']
})
export class CustomizeOrdersAddModalComponent implements OnInit {

    orderDetails: CustomizeOrderModel = {};
    technicianName = "";
    imageToShow: any;
    isImagLoaded = false;
    sendNotification: boolean = false;
    message: string = "";

    constructor(public dialogRef: MatDialogRef<CustomizeOrdersAddModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private customizeOrdersService: CustomizeOrdersService, private sanitizer: DomSanitizer,
        private globals: Globals, private properityService: ProperityService) { }

    ngOnInit(): void {
        this.orderDetails = this.data.orderDetails[0];

        if (this.data) {
            this.orderDetails = this.data.orderDetails;
            this.getPhoto(this.orderDetails.photo);
            if (this.orderDetails.rate) {
                this.orderDetails.rate = this.orderDetails.rate[1] + " Stars";
            } else {
                this.orderDetails.rate = "No Rate";
            }
        }
    } 

    getPhoto(path) {
        if (path != "" && path != null) {
            this.customizeOrdersService.getImage(path).subscribe((result: any) => {
                var binary = '';
                var bytes = new Uint8Array(result);
                var len = bytes.byteLength;
                for (var i = 0; i < len; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                let img = window.btoa(binary);
                this.imageToShow = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + img);
                this.isImagLoaded = true;
            });
        }
    }

    assighOrder() {
        const dataObj = {
            'customizedServiceId': this.orderDetails.customizedServiceId,
            'technicianName': this.technicianName,
        };
        this.customizeOrdersService.AssignteOrder(dataObj).subscribe(a => {
            this.dialogRef.close(true);
        });
    }

    completeOrder() {
        const dataObj = {
            'customizedServiceId': this.orderDetails.customizedServiceId,
            'price': this.orderDetails.price,
        };
        this.customizeOrdersService.CompleteOrder(dataObj).subscribe(a => {
            this.dialogRef.close(true);
        });
    }

    rollBackOrder() {
        const dataObj = {
            'customizedServiceId': this.orderDetails.customizedServiceId,
            'status': 'ASSIGNED',
            'targetDate': this.orderDetails.targetDate,
            'technician': this.orderDetails.technician
        };
        this.customizeOrdersService.RollBackOrder(dataObj).subscribe(a => {
            this.dialogRef.close(true);
        });
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
        this.properityService.sendMessage(this.orderDetails.userId, data).subscribe(result => {
          this.dialogRef.close();
          this.globals.presentSuccessToast("Message sent successfully")
        });
    }

    onClickCancel(): void {
        this.dialogRef.close(false);
    }
}
