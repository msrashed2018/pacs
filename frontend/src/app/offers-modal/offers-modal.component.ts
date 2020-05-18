import { Component, Inject, OnInit } from "@angular/core";
import { OffersModel } from "../models/OffersModel";
import { OffersService } from "../services/offers.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";
import { DatePipe } from "@angular/common";
import { Globals } from "../globals";

@Component({
  selector: "app-offers-modal",
  templateUrl: "./offers-modal.component.html",
  styleUrls: ["./offers-modal.component.css"]
})
export class OffersModalComponent implements OnInit {
  dataObj: OffersModel = {};
  primaryImage = "";
  images = [];
  seletcdImage: any = {};
  imageCursor = 0;
  myStartDate: Date;
  myEndDate: Date;
  isUpdate = false;
  isAdd = false;
  refreshList = false;

  constructor(
    public dialogRef: MatDialogRef<OffersModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private offersService: OffersService,
    private sanitizer: DomSanitizer,
    private globals: Globals
  ) {
    if (data) {
      this.isUpdate = data.isUpdate;
      this.isAdd = data.isAdd;
      if (data.offerDetails) {
        this.dataObj = data.offerDetails;
        if (!this.isAdd) {
          this.myStartDate = new Date(this.dataObj.startDate);
          this.myEndDate = new Date(this.dataObj.endDate);
          this.getPhoto(this.dataObj.primaryImage).subscribe((result: any) => {
            this.primaryImage = result;
          });
          this.dataObj.images.forEach((element, index) => {
            this.getPhoto(element.imagePath).subscribe((result: any) => {
              this.images.push({ id: element.id, imagePath: result });
              if (index == 0) {
                this.seletcdImage = this.images[0];
              }
            });
          });
        }
      }
    }
  }

  ngOnInit(): void {
  }


  getPhoto(path) {
    const ImageObservable = new Observable(observer => {
      if (path != "" && path != null) {
        this.offersService.getImage(path).subscribe((result: any) => {
          var binary = "";
          var bytes = new Uint8Array(result);
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          var newImage = window.btoa(binary);
          observer.next(
            this.sanitizer.bypassSecurityTrustUrl(
              "data:image/jpg;base64, " + newImage
            )
          );
        });
      } else {
        observer.next("");
      }
    });
    return ImageObservable;
  }

  updatePrimaryImage() {
    let element: HTMLElement = document.getElementById(
      "primaryImageFileUpload"
    ) as HTMLElement;
    element.click();
  }

  onPrimaryImagSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        var img = new Image();
        img.onload = () => {
          if (img.width < 351 && img.height < 151) {
            let imageURL = event.target.result;
            if (this.isUpdate) {
              let file = this.dataURItoBlob(imageURL);
              this.offersService
                .UpdatePrimaryImage(this.dataObj.id, file)
                .subscribe(res => {
                  this.refreshList = true;
                  this.getPhoto(res["primaryImage"]).subscribe(
                    (result: any) => {
                      this.primaryImage = result;
                    }
                  );
                });
            } else {
              this.primaryImage = imageURL;
            }
          } else {
            this.globals.presentErrorToast("The Image Size must be less than Width:350px, Heigth 150px");
          }
        };
        img.src = reader.result as string;
      };
    }
  }

  deleteImage() {
    if (!this.isAdd) {
      let ImageID = this.dataObj.images[this.imageCursor].id;
      this.offersService
        .DeleteImage(this.dataObj.id, ImageID)
        .subscribe(res => {
          this.refreshList = true;
          this.images.splice(this.imageCursor, 1);
          this.imageCursor--;
          if (this.images.length > 0) {
            if (this.imageCursor < 0) {
              this.imageCursor = 0;
            }
            this.seletcdImage = this.images[this.imageCursor];
          } else {
            this.seletcdImage = {};
          }
        });
    } else {
      this.images.splice(this.imageCursor, 1);
      this.imageCursor--;
      if (this.images.length > 0) {
        if (this.imageCursor < 0) {
          this.imageCursor = 0;
        }
        this.seletcdImage = this.images[this.imageCursor];
      } else {
        this.seletcdImage = {};
      }
    }
  }
  addImage() {
    let element: HTMLElement = document.getElementById(
      "imageFileUpload"
    ) as HTMLElement;
    element.click();
  }

  onImagSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        var img = new Image();
        img.onload = () => {
          if (img.width < 351 && img.height < 151) {
            let imageURL = event.target.result;
            if (this.isUpdate) {
              let file = this.dataURItoBlob(imageURL);
              this.offersService
                .AddImage(this.dataObj.id, file)
                .subscribe(res => {
                  this.refreshList = true;
                  this.dataObj.images = res["images"];
                  this.getPhoto(
                    this.dataObj.images[this.dataObj.images.length - 1]
                      .imagePath
                  ).subscribe((result: any) => {
                    this.images.push({
                      id: this.dataObj.images[this.dataObj.images.length - 1]
                        .id,
                      imagePath: result
                    });
                    this.imageCursor = this.images.length - 1;
                    this.seletcdImage = this.images[this.imageCursor];
                  });
                });
            } else {
              this.images.push({ id: 0, imagePath: imageURL });
              this.imageCursor = this.images.length - 1;
              this.seletcdImage = this.images[this.imageCursor];
            }
          } else { 
            this.globals.presentErrorToast("The Image Size must be less than Width:350px, Heigth 150px");
          }
        };
        img.src = reader.result as string;
      };
    }
  }

  nextImage() {
    if (this.images.length > this.imageCursor + 1) {
      this.imageCursor++;
      this.seletcdImage = this.images[this.imageCursor];
    }
  }

  pastImage() {
    if (this.imageCursor - 1 >= 0) {
      this.imageCursor--;
      this.seletcdImage = this.images[this.imageCursor];
    }
  }

  addOffers() {
    if (this.primaryImage) {
      this.dataObj.primaryImageFile = this.dataURItoBlob(this.primaryImage);
      this.dataObj.imagesFiles = [];
      this.images.forEach((element, index) => {
        this.dataObj.imagesFiles.push(this.dataURItoBlob(element.imagePath));
      });
      var datePipe = new DatePipe("en");
      this.dataObj.startDate = datePipe.transform(
        this.myStartDate,
        "yyyy-MM-dd HH:mm:ss"
      );
      this.dataObj.endDate = datePipe.transform(
        this.myEndDate,
        "yyyy-MM-dd HH:mm:ss"
      );
      this.offersService.AddOffer(this.dataObj).subscribe(res => {
        this.dialogRef.close(true);
      });
    } else {
      this.globals.presentErrorToast("Please Select Primaey Image");
    }
  }

  onClickCancel(): void {
    this.dialogRef.close(this.refreshList);
  }

  updateOffer() {
    var datePipe = new DatePipe("en");
    this.dataObj.startDate = datePipe.transform(
      this.myStartDate,
      "yyyy-MM-dd HH:mm:ss"
    );
    this.dataObj.endDate = datePipe.transform(
      this.myEndDate,
      "yyyy-MM-dd HH:mm:ss"
    );

    this.offersService.UpdateOffer(this.dataObj).subscribe(res => {
      this.dialogRef.close(true);
    });
  }

  dataURItoBlob(dataURI: any) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString: any;
    if (dataURI.split(",")[0].indexOf("base64") >= 0) {
      byteString = atob(dataURI.split(",")[1]);
    } else {
      byteString = unescape(dataURI.split(",")[1]);
    }
    // separate out the mime component
    const mimeString = dataURI
      .split(",")[0]
      .split(":")[1]
      .split(";")[0];
    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }
}
