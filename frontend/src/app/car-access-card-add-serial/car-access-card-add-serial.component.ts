import { Component, OnInit, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccessCardService } from 'app/services/access-card.service';
import { AccessCardContentModel } from 'app/models/AccessCardContentModel';
import { AccessCardNumbersModel } from 'app/models/AccessCardNumbersModel';
import { CustomizeOrdersService } from '../services/customize-order.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-car-access-card-add-serial',
  templateUrl: './car-access-card-add-serial.component.html',
  styleUrls: ['./car-access-card-add-serial.component.css']
})
export class CarAccessCardAddSerialComponent implements OnInit {

  cardId: number;
  serialFirstNumber: string;
  serialSecNumber: string;
  currentObjId: number;
  isToApprove = true;
  accessCardObj: AccessCardContentModel = {};
  accessNumbers: AccessCardNumbersModel = {};
  frontImage: any;
  frontImageLoaded = false;
  backImage: any;
  backImageLoaded = false;

  constructor(
    public dialogRef: MatDialogRef<CarAccessCardAddSerialComponent>,
    private customizeOrdersService: CustomizeOrdersService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any, private accessCardService: AccessCardService) {

    this.accessCardObj = data.accessCard;
    this.getPhoto(this.accessCardObj.licenseFrontImage, true);
    this.getPhoto(this.accessCardObj.licenseBackImage, false);
    this.currentObjId = data.accessCard.accessCardId;
    if (data.accessCard.cardNumber1) {
      this.isToApprove = false;
    }
  }

  ngOnInit() {
  }

  ApproveAccessCardAndUpdateSerial() {
    if (this.accessCardObj.cardNumber1 && this.accessCardObj.accessCardId) {

      this.accessNumbers.accessCardId = this.accessCardObj.accessCardId;
      this.accessNumbers.cardNumber1 = this.accessCardObj.cardNumber1;
      this.accessNumbers.cardNumber2 = "";

      if (this.isToApprove) {
        this.accessCardService.approveAccessWithSerial(this.accessNumbers).subscribe(a => {
          this.dialogRef.close(true);
        });
      } else {
        this.accessCardService.updateAccessWithSerial(this.accessNumbers).subscribe(a => {
          this.dialogRef.close(true);
        });
      }
    }
  }

  getPhoto(path, isFront) {
    if (path != "" && path != null) {
      this.customizeOrdersService.getImage(path).subscribe((result: any) => {
        var binary = '';
        var bytes = new Uint8Array(result);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        let img = window.btoa(binary);
        if (isFront) {
          this.frontImage = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + img);
          this.frontImageLoaded = true;
        }
        else {
          this.backImage = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + img);
          this.backImageLoaded = true;
        }
      });
    }
  }

  onClickCancel(): void {
    this.dialogRef.close();
  }
}