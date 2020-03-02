import { Component, OnInit, Input, Inject } from '@angular/core';
import { Tag } from 'app/models/tag.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

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
