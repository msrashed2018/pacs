import { Component, OnInit, Input, Inject } from '@angular/core';
import { Instance } from 'app/models/instance.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-instance',
  templateUrl: './instance.component.html',
  styleUrls: ['./instance.component.scss']
})
export class InstanceComponent implements OnInit {
  @Input('value') instance: Instance;
  constructor(
    public dialogRef: MatDialogRef<InstanceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit() {
    if(this.data.instance){
      this.instance=this.data.instance;
    }
  }

}
