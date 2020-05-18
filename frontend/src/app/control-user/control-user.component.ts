import { Component, OnInit, ViewChildren, QueryList } from "@angular/core";
import { ControlUserService } from "app/services/control-user.service";
import { SystemUserModel } from "app/models/SystemUserModel";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { TableUtil } from "app/models/TableUtil";
import { UsersModalComponent } from "../Users-modal/users-modal.component";
import { AddUserModalComponent } from "../add-user-modal/add-user-modal.component";
import { ConfirmationComponent } from "../confirmation/confirmation.component";
import { ConfigClass, EditPrivilege, ViewPrivilege } from "../config";
import { RoleEnum, UserRulesDisplayNames } from "../models/RoleModel";
import { Router } from "@angular/router";

@Component({
  selector: "app-control-user",
  templateUrl: "./control-user.component.html",
  styleUrls: ["./control-user.component.css"]
})
export class ControlUserComponent implements OnInit {
  user: SystemUserModel = {};
  users: SystemUserModel[] = [];
  isChecked;
  filterBy: string;
  iconAllowUpdate: boolean = true;
  iconAllowSave: boolean = false;
  distinctProjectsName: any[] = [];
  dataSource;
  displayedColumns: string[] = [
    "FirstAndLastName",
    "Email",
    "Username",
    "Mobile",
    // "ReportingManager",
    // "Role",
    "RegisteredDate",
    "LastLogin",
    "isEnabled"
  ];
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  totalPages = 0;
  filters = {
    firstAndLastName: "",
    email: "",
    mobile: "",
    // reportingManager: "",
    role: "USER",
    registeredDate: "",
    isEnabled: "",
    page: 0,
    size: 20
  };
  servicesArr: any = [];
  roles = [];
  enablePrivilages: boolean = true;

  constructor(
    private controlUserService: ControlUserService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  isAllowUpdateForPrice(id) { }

  ngOnInit() {
    this.enablePrivilages = ConfigClass.getPrivilageStatus;
    this.fillRoles();
    this.listAllUsers();
    this.checkPrivilage();
  }

  checkPrivilage() {
    if (ConfigClass.getPrivilageStatus) {
      let willShow = false;
      let privilage = JSON.parse(sessionStorage.getItem("privilage"));
      privilage.forEach(element => {
        if (element.name == EditPrivilege.USERS_EDIT) {
          this.displayedColumns.push("Action");
          willShow = true;
        } else {
          if (element.name == ViewPrivilege.USERS + "_VIEW") {
            willShow = true;
          }
        }
      });
      if (!willShow) {
        this.router.navigate(["dashboard"]);
      }
    } else {
      this.displayedColumns.push("Action");
    }
  }

  fillRoles() {
    this.roles.push({ id: "", name: "ALL" });
    
    this.roles.push({ id: RoleEnum.USER, name: UserRulesDisplayNames.USER });
    // this.roles.push({ id: RoleEnum.ADMIN, name: UserRulesDisplayNames.ADMIN });
    // this.roles.push({
    //   id: RoleEnum.CUSTOMER_SERVICES,
    //   name: UserRulesDisplayNames.CUSTOMER_SERVICES
    // });
    // this.roles.push({
    //   id: RoleEnum.SECURITY,
    //   name: UserRulesDisplayNames.SECURITY
    // });
    // this.roles.push({ id: RoleEnum.USER, name: RoleEnum.USER });
  }

  getRoles(roles) {
    try {
      let name = "";
      roles.forEach(element => {
        name += " " + UserRulesDisplayNames[element.name] + " ,";
      });
      return name.substring(0, name.length - 1);
    } catch (e) {
      return "";
    }
  }

  listAllUsers() {
    if (this.filters.registeredDate) {
      var date = new Date(this.filters.registeredDate);
      let month = date.getMonth() + 1;
      let day = date.getDate();
      this.filters.registeredDate =
        date.getFullYear() +
        "-" +
        (month.toString().length > 1 ? month : "0" + month) +
        "-" +
        (day.toString().length > 1 ? day : "0" + day);
    }

    if (!this.filters.registeredDate) {
      this.filters.registeredDate = "";
    }

    this.controlUserService.GetUsers(this.filters).subscribe(result => {
      this.users = result ? result.content : null;
      this.dataSource = new MatTableDataSource<SystemUserModel>(this.users);
      this.totalPages = result.totalPages;
    });
  }

  resetFilter() {
    this.filters = {
      firstAndLastName: "",
      email: "",
      mobile: "",
      // reportingManager: "",
      role: "USER",
      registeredDate: "",
      isEnabled: "",
      page: 0,
      size: 20
    };
    this.listAllUsers();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddUserModalComponent, {
      width: "700px",
      disableClose: true,
      autoFocus: true
    });
    dialogRef.afterClosed().subscribe(fetchedData => {
      if (fetchedData) {
        this.listAllUsers();
      }
    });
  }

  openViewDialog(obj): void {
    const dialogRef = this.dialog.open(UsersModalComponent, {
      width: "700px",
      disableClose: true,
      autoFocus: true,
      data: {
        user: obj,
        viewOnly: true
      }
    });
    dialogRef.afterClosed().subscribe(fetchedData => {
      // this.listAllSubscriptions();
    });
  }

  openUpdateDialog(obj): void {
    const dialogRef = this.dialog.open(UsersModalComponent, {
      width: "800px",
      data: {
        user: obj,
        allowUpdate: true
      }
    });
    dialogRef.afterClosed().subscribe(fetchedData => {
      if (fetchedData) {
        this.listAllUsers();
      }
    });
  }

  openConfirmDialog(obj): void {
    let msg =
      "Are you sure to disable this User? \nThis user will not be able to login.";
    if (!obj.enabled) {
      msg =
        "Are you sure to enable this User? \nThis user will be able to login.";
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: "350px",
      disableClose: false,
      autoFocus: false,
      data: { msg }
    });
    dialogRef.afterClosed().subscribe(fetchedData => {
      if (fetchedData) {
        if (obj.enabled) {
          this.controlUserService.DisableUser(obj.id).subscribe(result => {
            this.listAllUsers();
          });
        } else {
          this.controlUserService.EnableUser(obj.id).subscribe(result => {
            this.listAllUsers();
          });
        }
      }
    });
  }

  export() {
    var table = document.getElementById("user-table");
    var tempTable: any = table.cloneNode(true);
    var cellIndex = tempTable.rows[0].cells.length;
    for (var i = 0; i < tempTable.rows.length; i++) {
      tempTable.rows[i].deleteCell(cellIndex - 1);
    }
    TableUtil.exportToExcel(tempTable, "Users");
  }

  pagination(type) {
    if (type == "next") {
      if (this.filters.page + 1 <= this.totalPages) {
        this.filters.page += 1;
        this.listAllUsers();
      }
    } else if (type == "back") {
      if (this.filters.page - 1 > -1) {
        this.filters.page -= 1;
        this.listAllUsers();
      }
    } else if (type == "last") {
      this.filters.page = this.totalPages - 1;
      this.listAllUsers();
    } else if (type == "first") {
      this.filters.page = 0;
      this.listAllUsers();
    }
  }

  onPageChange(size) {
    if (this.filters.size != size) {
      this.filters.size = Number(size);
      this.filters.page = 0;
      this.listAllUsers();
    }
  }
}
