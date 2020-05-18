import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Series } from '../../../models/series.model';
import { MatDialog } from '@angular/material/dialog';
import { SeriesComponent } from 'app/shared/dicom-tags/series/series.component';

@Component({
  selector: 'app-serieses',
  templateUrl: './serieses.component.html',
  styleUrls: ['./serieses.component.scss']
})
export class SeriesesComponent implements OnInit {
  @Input('value') serieses: Series[];
  @Output('seriesSelected') series : EventEmitter<Series>= new EventEmitter<Series>();
  constructor( public dialog: MatDialog) { }

  ngOnInit() {
    console.log("series")
  }
  onSeriesSelected(selectedSeries: Series){
    this.series.emit(selectedSeries);
  }
  onView(seriesObj){
    const dialogRef = this.dialog.open(SeriesComponent, {
      width: "1000px",
      height:"900px",
      disableClose: false,
      autoFocus: true,
      
      data: {
        series: seriesObj
      }
    });
    dialogRef.afterClosed().subscribe(fetchedData => {
      if (fetchedData) {
      }
    }); 
  }

}
