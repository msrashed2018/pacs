import { Component, OnInit, Input } from '@angular/core';
import { Image } from 'app/models/image.model';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {
  @Input('value') equipment: Image;
  constructor() { }

  ngOnInit() {
  }

}
