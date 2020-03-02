import { Component, OnInit, Input } from '@angular/core';
import { Equipment } from 'app/models/equipment.model';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit {
  @Input('value') equipment: Equipment;
  constructor() { }

  ngOnInit() {
  }

}
