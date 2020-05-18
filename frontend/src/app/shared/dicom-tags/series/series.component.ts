import { Component, OnInit, Input, Inject } from '@angular/core';
import { Series } from 'app/models/series.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})
export class SeriesComponent implements OnInit {
  @Input('value') series: Series;
  
  constructor(
    public dialogRef: MatDialogRef<SeriesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,


  ) { }

  ngOnInit() {
    if(this.data.series){
      this.series=this.data.series;
    }
  }

}
