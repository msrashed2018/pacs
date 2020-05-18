import { Component, OnInit, Input } from '@angular/core';
import { API_URL } from 'app/config';
import { Instance } from 'app/models/instance.model';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {
  @Input('value') instances: Instance[];
  
  imagesUrls: string[] = [];

  constructor() { 
    
  }

  ngOnInit() {

    
    for(let instance of this.instances){
      if(instance.pkTBLInstanceID){
        this.imagesUrls.push(API_URL+`/images/${instance.pkTBLInstanceID}`)
      }
    }
  }

}
