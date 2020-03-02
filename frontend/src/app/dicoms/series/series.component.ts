import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Series } from '../../models/series.model';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})
export class SeriesComponent implements OnInit {
  @Input('value') serieses: Series[];
  @Output('seriesSelected') series : EventEmitter<Series>= new EventEmitter<Series>();
  constructor() { }

  ngOnInit() {
    console.log("series")
  }
  onSeriesSelected(selectedSeries: Series){
    this.series.emit(selectedSeries);
  }
}
