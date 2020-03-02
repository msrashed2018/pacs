import { Component, OnInit, Inject } from '@angular/core';
import { ApplicationEntity } from '../application-entity.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApplicationEntityService } from '../application-entity.service';

@Component({
  selector: 'app-add-application-entity',
  templateUrl: './add-application-entity.component.html',
  styleUrls: ['./add-application-entity.component.scss']
})
export class AddApplicationEntityComponent implements OnInit {
  private data: ApplicationEntity = new ApplicationEntity();
  errorMessage: string = "";
  constructor(
    private applicationEntityService: ApplicationEntityService,
    public dialogRef: MatDialogRef<AddApplicationEntityComponent>
    // ,@Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    this.applicationEntityService.createApplicationEntity(this.data)
      .subscribe(
        result => {
          this.dialogRef.close();
        },
        error => {
          console.error(error);
          this.errorMessage = error.error.message
        }
      )
  }
}
