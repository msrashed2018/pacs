import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ProjectsModel } from "app/models/ProjectsModel";
import { ProjectService } from "app/services/project.service";
import { Globals } from "../globals";

@Component({
  selector: "app-projects-add-modal",
  templateUrl: "./projects-add-modal.component.html",
  styleUrls: ["./projects-add-modal.component.css"]
})
export class ProjectsAddModalComponent implements OnInit {
  projects: ProjectsModel[] = [];
  project: ProjectsModel = {};
  permission: string = "";

  constructor(
    public dialogRef: MatDialogRef<ProjectsAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: ProjectService,
    private globals: Globals
  ) { }

  ngOnInit() {
    this.project = this.data.project;
    this.permission = this.data.permission;
  }

  saveProject() {
    if (this.permission == "add") {
      // this.project.icon = this.iconName;
      this.projectService.CreateProject(this.project).subscribe(a => {
        this.dialogRef.close(true);
        this.globals.presentSuccessToast("Project has been added successfully");
      });
    } else {
      // this.project.icon = this.iconName;
      this.projectService.UpdateProject(this.project).subscribe(a => {
        this.dialogRef.close(true);
        this.globals.presentSuccessToast("Project has been updated successfully");
      });
    }
  }

  onClickCancel(): void {
    this.dialogRef.close();
  }
}

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
