import { Component, OnInit, Input, Inject } from '@angular/core';
import { Tag } from 'app/models/tag.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-all-tags',
  templateUrl: './all-tags.component.html',
  styleUrls: ['./all-tags.component.scss']
})
export class AllTagsComponent implements OnInit {
  // @Input('tags') tags: Tag[];
  constructor(
    public dialogRef: MatDialogRef<AllTagsComponent>,
    @Inject(MAT_DIALOG_DATA) public tags: Tag[]
  ) { }

  ngOnInit() {
  }

}
