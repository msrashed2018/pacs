import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Globals } from "../globals";
import { RoleEnum, UserRulesDisplayNames } from "../models/RoleModel";
import { Privilege } from "../models/SystemUserModel";
import { ControlUserService } from "../services/control-user.service";

@Component({
  selector: "app-add-user-modal",
  templateUrl: "./add-user-modal.component.html",
  styleUrls: ["./add-user-modal.component.css"]
})
export class AddUserModalComponent implements OnInit {
  privileges: Privilege[] = [];
  viewOnly = true;
  allowUpdate = false;
  role: any = {};
  roles = [
    // { id: 1, name: RoleEnum.USER },
    {
      id: 1,
      name: RoleEnum.USER,
      displayName: UserRulesDisplayNames.USER
    },
    // {
    //   id: 3,
    //   name: RoleEnum.CUSTOMER_SERVICES,
    //   displayName: UserRulesDisplayNames.CUSTOMER_SERVICES
    // },
    // { id: 4, name: RoleEnum.ADMIN, displayName: UserRulesDisplayNames.ADMIN }
  ];
  userObj = {
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    mobile: "",
    email: "",
    age: 0,
    // intMobile: "",
    gender: "",
    birthdate: "",
    roles: [],
    // annualIncome: "",
    // idNumber: "",
    // passportNumber: "",
    privileges: [],
    // reportingManager: ""
  };
  constructor(
    public dialogRef: MatDialogRef<AddUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: ControlUserService,
    private globals: Globals
  ) {}

  ngOnInit() {
    
    this.getAllPrivileges();
  }

  getAllPrivileges() {
    this.privileges = this.globals.getUserPrivilages();
    this.privileges.forEach(privilege => {
      privilege.checked = false;
    });
  }

  onClickCancel(): void {
    this.dialogRef.close();
  }

  onClickSave(): void {
    //role
    this.userObj.roles = [{ name: this.role.name }];

    //privileges
    this.privileges.forEach(privilege => {
      if (privilege.checked === true) {
        this.userObj.privileges.push({ name: privilege.name });
      }
    });

    //age
    var cuurentYear = new Date().getFullYear();
    this.userObj.age =
      cuurentYear - new Date(this.userObj.birthdate).getFullYear();

    this.userService.AddUser(this.userObj).subscribe(a => {
      this.dialogRef.close(true);
      this.globals.presentSuccessToast("User has been added susccessfully");
    });
  }
}
