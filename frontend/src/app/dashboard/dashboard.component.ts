import { Component, OnInit } from "@angular/core";
import { DashBoardModel } from "../models/DashboardModel";
import { DashboardService } from "../services/dashboard.service";
import { ConfigClass, ViewPrivilege } from '../config';
import { Router } from '@angular/router';
import { Globals } from "../globals";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  dashboardModel: DashBoardModel = {};
  time: string = "";
  timer: any = null;
  inValid = false;
  constructor(private dashboardService: DashboardService, private router: Router, private globals: Globals) { }

  ngOnInit() {
    
    
    this.checkPrivilage();
    // setTimeout(() => {
    //   this.refreshAccessToken();
    // }, (this.globals.getVariable("loginResponse").expires_in - 10) * 100);

  }

  checkPrivilage() {
    if (ConfigClass.getPrivilageStatus) {
      let willShow = false;
      let privilage = JSON.parse(sessionStorage.getItem("privilage"));
      privilage.forEach(element => {
        if (element.name == ViewPrivilege.DASHBOARD + "_VIEW") {
          willShow = true;
        }
      });
      if (!willShow) {
        if (privilage.length > 0) {
          this.router.navigate([this.globals.getRouting(privilage[0].name)]);
        }
        else {
          this.globals.notPermittedLogin();
        }
      }
      else {
        this.getAllStatistics();
        if (this.timer == null) {
          this.timer = setInterval(() => {
            this.getAllStatistics();
          }, 600000);
        }
      }
    }
    else {
      this.getAllStatistics();
      if (this.timer == null) {
        this.timer = setInterval(() => {
          this.getAllStatistics();
        }, 600000);
      }
    }
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }

  refreshAccessToken() {
    // if (this.globals.getVariable("isLoggedIn")) {
    //   this._http.post("oauth/token?grant_type=refresh_token&refresh_token=" + this.globals.getVariable("loginResponse").refresh_token, "").subscribe(result => {
    //     this.globals.setVariable("accessToken", result.access_token);
    //     this.globals.setVariable("loginResponse", result);
    //     setTimeout(() => {
    //       this.refreshAccessToken();
    //     }, (result.expires_in - 10) * 100)
    //   });
    // }
  }

  getAllStatistics() {
    this.dashboardModel = {};
    this.dashboardService.GetAllStates().subscribe(
      res => {
        this.dashboardModel = res;
        this.time = new Date().toLocaleTimeString();
      }
    );
  }
}
