import { Component, OnInit, Input } from '@angular/core';
import { Instance } from 'app/models/instance.model';

@Component({
  selector: 'app-instance',
  templateUrl: './instance.component.html',
  styleUrls: ['./instance.component.scss']
})
export class InstanceComponent implements OnInit {
  @Input('value') instance: Instance;
  constructor() { }

  ngOnInit() {
  }

}
