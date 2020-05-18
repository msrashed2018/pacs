import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderService } from '../services/order.service';
import { OrderModel } from '../models/OrderModel';
import { OrderItemsModel } from '../models/OrderItemsModel';
import { EventEmitterService } from '../event-emitter.service';
import { ProperityService } from '../services/properity.service';
import { Globals } from "../globals";

@Component({
    selector: 'app-orders-add-modal',
    templateUrl: './orders-add-modal.component.html',
    styleUrls: ['./orders-add-modal.component.css']
})
export class OrdersAddModalComponent implements OnInit {

    orderDetails: OrderModel = {};
    orderItems: OrderItemsModel[] = [];
    status = '';
    techname;
    sendNotification: boolean = false;
    message: string = "";

    constructor(public dialogRef: MatDialogRef<OrdersAddModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private orderService: OrderService, private eventEmitterService: EventEmitterService,
        private globals: Globals, private properityService: ProperityService) { }

    ngOnInit(): void {
        this.orderDetails = this.data.orderDetails[0];
        if (this.data) {
            this.status = this.data.status;
            if (this.data.status === 'PENDING') {
                this.orderService.GetOrderItems(this.data.orderId).subscribe(items => {
                    this.orderItems = items['content'];
                })
            }
            else if (this.data.status === 'DONE') {
                if (this.orderDetails.rate) {
                    this.orderDetails.rate = this.orderDetails.rate[1] + " Stars";
                }
            }
        }
    }

    gotoAssighOrder(technicianName) {
        const dataObj = {
            'orderId': this.data.orderId,
            'technicianName': technicianName,
        };
        this.orderService.AssignteOrder(dataObj).subscribe(a => {
            this.eventEmitterService.onFirstComponentButtonClick();
            this.dialogRef.close();
        });
    }

    gotoVerifyOrder() {
        const dataObj = {
            'orderId': this.data.orderId,
            'extraFees': "",
            'extraFeesComment': ""
        };
        this.orderService.CompleteOrder(dataObj).subscribe(a => {
            this.eventEmitterService.onFirstComponentButtonClick();
            this.dialogRef.close();
        });
    }

    gotoRollBackOrder() {
        const dataObj = {
            'orderId': this.data.orderId,
            'status': 'ASSIGNED',
            'targetDate': this.orderDetails.targetDate,
            'technician': this.orderDetails.technician
        };
        this.orderService.RollBackOrder(dataObj).subscribe(a => {
            this.eventEmitterService.onFirstComponentButtonClick();
            this.dialogRef.close();
        });
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
        this.properityService.sendMessage(this.orderDetails.userId, data).subscribe(result => {
            this.dialogRef.close();
            this.globals.presentSuccessToast("Message sent successfully")
        });
    }
}
