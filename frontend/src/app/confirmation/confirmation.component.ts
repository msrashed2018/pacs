import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-confirmation",
  templateUrl: "./confirmation.component.html",
  styleUrls: ["./confirmation.component.css"]
})
export class ConfirmationComponent implements OnInit {
  msg = "Are you sure?"

  msgList: string[];

  constructor(
    public dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.msg) {
      this.msg = data.msg;
      this.msgList = data.msgList;
    }
  }

  ngOnInit(): void { }

  onNoClick(type) {
    if (type == "false") this.dialogRef.close(false);
    else this.dialogRef.close(true);
  }
}
