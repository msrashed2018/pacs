import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { SystemUserModel, Privilege } from "../models/SystemUserModel";
import { RoleEnum, UserRulesDisplayNames } from "../models/RoleModel";
import { ControlUserService } from "../services/control-user.service";
import { AuthenticationService } from "../services/authentication.service";
import { RoleService } from "../services/role.service";
import { Globals } from "../globals";
import { ConfigClass } from "../config";

@Component({
  selector: "app-users-modal",
  templateUrl: "./users-modal.component.html",
  styleUrls: ["./users-modal.component.css"]
})
export class UsersModalComponent implements OnInit {
  userObj: SystemUserModel = {};
  privileges: Privilege[] = [];
  viewOnly = true;
  allowUpdate = false;
  disabledPriv = false;
  role: any = {name :RoleEnum.USER};
  roles = [
    // { id: 1, name: RoleEnum.USER },
    {
      name: RoleEnum.USER,
      displayName: UserRulesDisplayNames.USER
    }
    // ,
    // {
    //   id: 3,
    //   name: RoleEnum.CUSTOMER_SERVICES,
    //   displayName: UserRulesDisplayNames.CUSTOMER_SERVICES
    // },
    // { id: 4, name: RoleEnum.ADMIN, displayName: UserRulesDisplayNames.ADMIN }
  ];

  onRoleChange(e) {
    
    this.disabledPriv = false;
    // if (
    //   this.role.name == RoleEnum.SECURITY ||
    //   this.role.name == RoleEnum.CUSTOMER_SERVICES
    // ) {
    //   this.disabledPriv = true;
    // } else {
    //   this.disabledPriv = false;
    // }
  }

  constructor(
    public dialogRef: MatDialogRef<UsersModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: ControlUserService,
    private globals: Globals
  ) {

    if (data && data.user) {
      this.userObj = data.user;
      // if (this.userObj.roles.length > 0) {
      //   if (this.userObj.roles[0].name.toString() != RoleEnum.USER) {
      //     this.role = this.userObj.roles[0];
      //     if (
      //       this.role.name == RoleEnum.SECURITY ||
      //       this.role.name == RoleEnum.CUSTOMER_SERVICES
      //     ) {
      //       this.disabledPriv = true;
      //     }
      //   } else {
      //     if (this.userObj.roles.length > 1) {
      //       this.role = this.userObj.roles[1];
      //       if (
      //         this.role.name == RoleEnum.SECURITY ||
      //         this.role.name == RoleEnum.CUSTOMER_SERVICES
      //       ) {
      //         this.disabledPriv = true;
      //       }
      //     }
      //   }
      // }

      if (data.viewOnly === true) {
        this.viewOnly = true;
        this.allowUpdate = false;
      } else if (data.allowUpdate === true) {
        this.viewOnly = false;
        this.allowUpdate = true;
      }
      this.userObj.isEnabled = this.userObj.enabled ? "YES" : "NO";
    }
  }

  ngOnInit() {
    this.getAllPrivileges();
  }

  getAllPrivileges() {
    // this.userService.GetAllPrivileges().subscribe(res => {

    this.privileges = this.globals.getUserPrivilages();
    if (this.userObj.privileges && this.privileges) {
      this.userObj.privileges.forEach(elemnt => {
        this.privileges.forEach(privilege => {
          if (elemnt.name == privilege.name) {
            privilege.checked = true;
          }
        });
      });
    }
    // });
  }

  onClickCancel(): void {
    this.dialogRef.close();
  }

  onClickSave(): void {
    // debugger;
    if (
      this.userObj.firstname &&
      this.userObj.lastname &&
      this.userObj.mobile &&
      this.userObj.email
    )
      if (this.allowUpdate) {
        // if (
        //   ConfigClass.getPrivilageStatus == false ||
        //   this.role.name != RoleEnum.ADMIN ||
        //   (this.role.name == RoleEnum.ADMIN &&
        //     this.userObj.roles &&
        //     this.userObj.roles[0] &&
        //     this.userObj.roles[0].name == RoleEnum.ADMIN)
        // ) {
          //role
          // this.role = this.roles.find(
          //   element => element.name == this.role.name
          // );
          this.userObj.roles = [{ name: this.role.name }];

          //privileges
          this.userObj.privileges = [];
          
          this.privileges.forEach(privilege => {
            if (privilege.checked === true) {
              this.userObj.privileges.push({ name: privilege.name });
            }
          });

          this.userService
            .UpdateUser(this.userObj.id, this.userObj)
            .subscribe(a => {
              this.dialogRef.close(true);
            });
        // } 
        
        // else {
        //   this.globals.presentErrorToast("Can't change Role to Admin");
        // }
      }
  }
}
