import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent  implements OnInit {
  @Input('value') image;
  // images=['https://www.gstatic.com/webp/gallery3/1.png','https://www.gstatic.com/webp/gallery3/1_webp_ll.png']
  public imageData = ' ' ;
  constructor() {
  }
  ngOnInit() {
    this.imageData='data:image/jpg;base64,'+this.image;
  }

}
