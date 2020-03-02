import { Component, OnInit, Input } from '@angular/core';
import { Series } from 'app/models/series.model';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})
export class SeriesComponent implements OnInit {
  @Input('value') series: Series;
  
  constructor() { }

  ngOnInit() {
  }

}
