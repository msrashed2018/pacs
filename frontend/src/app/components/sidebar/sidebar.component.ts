import { Component, OnInit } from "@angular/core";
import { ConfigClass, ViewPrivilege, EditPrivilege } from "../../config";

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  role: string;
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: "dashboard",
    class: "",
    role: ViewPrivilege.DASHBOARD
  },
  // {
  //   path: "/CatgSubscription",
  //   title: "Categorois Subscription",
  //   icon: "group_work",
  //   class: "",
  //   role: ViewPrivilege.SUBSCRIPTION_CATEGORY
  // },
  {
    path: "/dicoms-search",
    title: "Dicoms Search",
    icon: "accessibility",
    class: "",
    role: ViewPrivilege.DICOMS_SEARCH
  },
  {
    path: "/dicoms-uploader",
    title: "Dicoms Uploader",
    icon: "accessibility",
    class: "",
    role: EditPrivilege.DICOMS_UPLOADER
  },
  {
    path: "/dicom-viewer",
    title: "Dicom Viewer",
    icon: "accessibility",
    class: "",
    role: ViewPrivilege.DICOM_VIEWER
  },
  {
    path: "/application-entities",
    title: "Application Entities",
    icon: "accessibility",
    class: "",
    role: ViewPrivilege.APPICATION_ENTITY_VIEW
  },
  {
    path: "/directory-watcher",
    title: "Directory Watcher",
    icon: "accessibility",
    class: "",
    role: ViewPrivilege.DIRECTORY_WATCHER_VIEW
  },
  // {
  //   path: "/gateAccess",
  //   title: "Gate access",
  //   icon: "accessibility",
  //   class: "",
  //   role: ViewPrivilege.GATE_ACCESS
  // },
  // {
  //   path: "/access-card",
  //   title: "Access Card",
  //   icon: "art_track",
  //   class: "",
  //   role: ViewPrivilege.ACCESS_CARD
  // },
  // {
  //   path: "/projects",
  //   title: "Projects",
  //   icon: "account_balance",
  //   class: "",
  //   role: ViewPrivilege.PROJECTS
  // },
  // {
  //   path: "/properity",
  //   title: "Property",
  //   icon: "person",
  //   class: "",
  //   role: ViewPrivilege.PROPERTY
  // },
  // {
  //   path: "/orders",
  //   title: "Orders",
  //   icon: "content_paste",
  //   class: "",
  //   role: ViewPrivilege.ORDERS
  // },
  // {
  //   path: "/customized-orders",
  //   title: "Customized Orders",
  //   icon: "work",
  //   class: "",
  //   role: ViewPrivilege.CUSTOMIZED_ORDERS
  // },
      {
        path: "/users",
        title: "Users",
        icon: "person_add",
        class: "",
        role: ViewPrivilege.USERS
      },
  // {
  //   path: "/subscription",
  //   title: "Subscription",
  //   icon: "monetization_on",
  //   class: "",
  //   role: ViewPrivilege.SUBSCRIPTION
  // },
  // {
  //   path: "/subscription-Catg",
  //   title: "Subscription Category",
  //   icon: "category",
  //   class: "",
  //   role: ViewPrivilege.SUBSCRIPTION_CATEGORY
  // },
  // {
  //   path: "/customized-service",
  //   title: "service",
  //   icon: "room_service",
  //   class: "",
  //   role: ViewPrivilege.SERVICE
  // },
  // {
  //   path: "/offers",
  //   title: "Offers",
  //   icon: "local_offer",
  //   class: "",
  //   role: ViewPrivilege.OFFERS
  // }
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = [];

  constructor() {}
  BreakException = {};
  ngOnInit() {
    let privilage = JSON.parse(sessionStorage.getItem("privilage"));
    if (ConfigClass.getPrivilageStatus) {
      // this.menuItems.push(ROUTES[0]);
      ROUTES.forEach(menuItem => {
        try {
          privilage.forEach(element => {
            let role = element.name.replace("_EDIT", "").replace("_VIEW", "");
            if (menuItem.role == role) {
              this.menuItems.push(menuItem);
              throw this.BreakException;
            }
          });
        } catch (e) {}
      });
    } else {
      this.menuItems = ROUTES;
    }
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
}
