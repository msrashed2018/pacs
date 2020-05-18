import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApplicationEntityService } from 'app/services/application-entity.service';
import { ApplicationEntity } from 'app/models/application-entity.model';
@Component({
  selector: 'app-add-application-entity',
  templateUrl: './add-application-entity.component.html',
  styleUrls: ['./add-application-entity.component.css']
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
  onClickCancel() {
    this.dialogRef.close();
  }

  onClickSave() {
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
