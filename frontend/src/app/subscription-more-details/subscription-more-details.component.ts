import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubscriptionAdminModel } from 'app/models/SubscriptionAdminModel';

@Component({
  selector: 'app-subscription-more-details',
  templateUrl: './subscription-more-details.component.html',
  styleUrls: ['./subscription-more-details.component.css']
})
export class SubscriptionMoreDetailsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SubscriptionMoreDetailsComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) {

      this.subscription = data.subscription;
    }


    
  subscription: SubscriptionAdminModel = {} ;
  getTotalGardenArea : number;
  ngOnInit() {



    
  }


 
  onClickCancel(): void {
    this.dialogRef.close();
}

  
  
  }
  


 
 

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}