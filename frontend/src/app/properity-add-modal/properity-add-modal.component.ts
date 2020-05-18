import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProperityService } from '../services/properity.service';
import { ProjectsModel } from '../models/ProjectsModel';
import { ProjectService } from '../services/project.service';
import { EventEmitterService } from '../event-emitter.service';
import { SubscriptionService } from "app/services/subscription.service";
import { Globals } from "../globals";

@Component({
    selector: 'app-properity-add-modal',
    templateUrl: './properity-add-modal.component.html',
    styleUrls: ['./properity-add-modal.component.css']
})
export class ProperityAddModalComponent implements OnInit {

    projectId: string = "";
    projects: ProjectsModel[] = [];
    residentTypes: any = [{ key: "OWNER", name: "Owner" }, { key: "TENANT", name: "Tenant" }, { key: "FAMILY_MEMBER", name: "Family Member" }];
    ownerType: string = "";
    dataObj: any = {
        'ownerFirstName': '',
        'ownerMiddleName': '',
        'ownerLastName': '',
        'ownerMobile': '',
        'ownerEmail': '',
        'ownerID': '',
        'number': '',
        'project': {},
        "userId": "",
        "propertyDetailId": "",
        "propertyId": ""
    };
    sendNotification: boolean = false;
    updatedata = false
    enableApprove: boolean = false;
    message: string = "";

    constructor(public dialogRef: MatDialogRef<ProperityAddModalComponent>, private projectService: ProjectService, private subscriptionService: SubscriptionService,
        @Inject(MAT_DIALOG_DATA) public data: any, private properityService: ProperityService, private eventEmitterService: EventEmitterService, private globals: Globals) { }

    ngOnInit(): void {
        this.listAllProjects();
        if (this.data) {
            this.ownerType = this.data.property.ownerType;
            this.dataObj.userId = this.data.property.userId;
            this.dataObj.propertyId = this.data.property.propertyId;
            if (this.ownerType == "OWNER") {
                this.getPropertyDetails(this.data.property.projectId, this.data.property.unitNumber, true);
            }
        }
    }

    getPropertyDetails(projectId, propertyNumber, isFirstTime) {
        this.properityService.GetProperityDetails(projectId, propertyNumber).subscribe(prDetails => {
            if (prDetails != null) {
                this.dataObj.ownerFirstName = prDetails.ownerFirstName;
                this.dataObj.ownerMiddleName = prDetails.ownerMiddleName;
                this.dataObj.ownerLastName = prDetails.ownerLastName;
                this.dataObj.ownerMobile = prDetails.ownerMobile;
                this.dataObj.ownerEmail = prDetails.ownerEmail;
                this.dataObj.ownerID = prDetails.ownerID;
                if (isFirstTime) {
                    this.dataObj.number = prDetails.number;
                    this.dataObj.project = prDetails.project;
                    this.projectId = prDetails.project.id;
                }
                this.dataObj.propertyDetailId = prDetails.id;
                this.updatedata = true;
                this.enableApprove = true;
            } else {
                this.dataObj.userId = this.data.property.userId;
                this.dataObj.ownerMobile = this.data.property.ownerMobile;
                this.dataObj.ownerID = this.data.property.ownerIdNumber;
                if (isFirstTime) {
                    this.dataObj.project = this.projects.filter(({ id }) => id === this.data.property.projectId)[0];
                    this.projectId = this.data.property.projectId;
                    this.dataObj.number = this.data.property.unitNumber;
                }
                this.dataObj.ownerEmail = this.data.property.ownerEmail;
                var temp = this.data.property.ownerName.split(" ");
                if (temp.length == 3) {
                    this.dataObj.ownerFirstName = temp[0];
                    this.dataObj.ownerMiddleName = temp[1];
                    this.dataObj.ownerLastName = temp[2];
                }
                else {
                    this.dataObj.ownerFirstName = temp[0];
                    this.dataObj.ownerLastName = temp[1];
                }
                this.updatedata = false;
            }
        })
    }

    projectChanged(projectId) {
        this.dataObj.project = this.projects.filter(({ id }) => id === projectId)[0];
        this.getPropertyDetails(projectId, this.dataObj.number, false);
    }

    proeprtyNumberChanged() {
        this.getPropertyDetails(this.projectId, this.dataObj.number, false);
    }

    verifyProperty() {
        var dataObj: any = {
            'propertyId': this.dataObj.propertyId,
            'projectId': this.dataObj.project.id,
            'unitNumber': this.dataObj.number,
            "ownerType": this.ownerType
        };
        if (this.ownerType == "OWNER") {
            dataObj.propertyDetailId = this.dataObj.propertyDetailId;
        }

        this.properityService.VerifyProperity(dataObj).subscribe(a => {
            // this.eventEmitterService.onFirstComponentButtonClick();
            this.dialogRef.close(true);
            this.globals.presentSuccessToast("Property has been verified successfully");
        });
    }

    save() {
        if (this.ownerType == "OWNER") {
            var data: any = {
                number: this.dataObj.number,
                ownerEmail: this.dataObj.ownerEmail,
                ownerFirstName: this.dataObj.ownerFirstName,
                ownerID: this.dataObj.ownerID,
                ownerLastName: this.dataObj.ownerLastName,
                ownerMiddleName: this.dataObj.ownerMiddleName,
                ownerMobile: this.dataObj.ownerMobile,
                project: this.dataObj.project
            };
            if (this.updatedata) {
                data.id = this.dataObj.propertyDetailId;
                this.updateProperty(data);
            }
            else {
                this.createProperty(data);
            }
        }
        else {
            this.verifyProperty();
        }
    }

    updateProperty(data) {
        this.properityService.UpdateProperity(data).subscribe(a => {
            this.verifyProperty();
        });
    }

    createProperty(data) {
        this.properityService.CreateProperityDetails(data).subscribe(prDetails => {
            this.enableApprove = true;
            this.dataObj.propertyDetailId = prDetails.id;
            this.verifyProperty();
        });
    }

    listAllProjects() {
        this.subscriptionService.getAllProjects().subscribe(result => {
            this.projects = result.content;
        });
    }

    send() {
        var data =
        {
            "message": this.message,
            "title": "Property Verification",
            "topic": "Property Verification"
        }
        this.properityService.sendMessage(this.dataObj.userId, data).subscribe(result => {
            this.dialogRef.close();
            this.globals.presentSuccessToast("Message sent successfully")
        });
    }

    onClickCancel(): void {
        this.dialogRef.close();
    }
}
