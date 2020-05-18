import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-delete-confirmation",
  templateUrl: "./delete-confirmation.component.html",
  styleUrls: ["./delete-confirmation.component.css"]
})
export class DeleteConfirmationComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  onNoClick(type) {
    if (type == "false") this.dialogRef.close(false);
    else this.dialogRef.close(true);
  }
}
