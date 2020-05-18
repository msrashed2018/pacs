import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Instance } from 'app/models/instance.model';
import { MatDialog } from '@angular/material/dialog';
import { InstanceComponent } from 'app/shared/dicom-tags/instance/instance.component';

@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.scss']
})
export class InstancesComponent implements OnInit {
  @Input('value') instances: Instance[];
  @Output('instanceSelected') instance : EventEmitter<Instance>= new EventEmitter<Instance>();
  
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }
  onInstanceSelected(selectedInstance: Instance){
    this.instance.emit(selectedInstance);
  }
  onView(instanceObj){
    const dialogRef = this.dialog.open(InstanceComponent, {
      width: "1000px",
      height:"900px",
      disableClose: false,
      autoFocus: true,
      
      data: {
        instance: instanceObj
      }
    });
    dialogRef.afterClosed().subscribe(fetchedData => {
      if (fetchedData) {
      }
    }); 
  }
}
