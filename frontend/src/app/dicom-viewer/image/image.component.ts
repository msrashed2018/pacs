import { Component, OnInit, Input } from '@angular/core';
import { randomImageSrc } from 'app/config';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent{
  @Input('value') image;
  constructor() { 
console.log(this.image);

    console.log("constructing image");
    
  }
}
