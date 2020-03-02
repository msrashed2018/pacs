import { Component, OnInit, Input } from '@angular/core';
import { Tag } from 'app/models/tag.model';

@Component({
  selector: 'app-all-tags',
  templateUrl: './all-tags.component.html',
  styleUrls: ['./all-tags.component.scss']
})
export class AllTagsComponent implements OnInit {
  @Input('tags') tags: Tag[];
  constructor() { }

  ngOnInit() {
  }

}
