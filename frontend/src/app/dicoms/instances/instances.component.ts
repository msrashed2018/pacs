import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Instance } from '../../models/instance.model';

@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.scss']
})
export class InstancesComponent implements OnInit {
  @Input('value') instances: Instance[];
  @Output('instanceSelected') instance : EventEmitter<Instance>= new EventEmitter<Instance>();
  
  constructor() { }

  ngOnInit() {
    console.log("instances")
  }
  onInstanceSelected(selectedInstance: Instance){
    this.instance.emit(selectedInstance);
  }
}
