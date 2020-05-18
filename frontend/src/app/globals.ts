import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

@Injectable()
export class Globals {

    private errorToast: any = "";
    private successToast: any = "";
    private variables: any = {
        loginResponse: {}
    }
    constructor(private router: Router) {
        this.errorToast = document.getElementById("errorToast");
        this.successToast = document.getElementById("successToast");
    }

    // get getVariable(key) { 
    //     return this.variables[key];
    // }
    async presentErrorToast(_msg) {
        if (!this.errorToast) {
            this.errorToast = document.getElementById("errorToast");
        }
        this.errorToast.innerHTML = _msg;
        this.errorToast.style.display = "block";
        setTimeout(() => {
            this.errorToast.style.display = "none";
            this.errorToast.innerHTML = "";
        }, 3000);
    }
    async presentSuccessToast(_msg) {
        if (!this.successToast) {
            this.successToast = document.getElementById("successToast");
        }
        this.successToast.innerHTML = _msg;
        this.successToast.style.display = "block";
        setTimeout(() => {
            this.successToast.style.display = "none";
            this.successToast.innerHTML = "";
        }, 3000);
    }

    getUserPrivilages() {
        return [
            { "name": "Dashboard", isHeader: true },
            { "name": "DASHBOARD_VIEW", "description": "View Dashboard", "descriptionAr": null, isHeader: false, isHidden: false },
            { "name": "EMPTY_SPACE1", "description": "for empty space", "descriptionAr": null, isHeader: false, isHidden: true },
            
            { "name": "Dicoms Search", isHeader: true },
            { "name": "DICOMS_SEARCH", "description": "Search Dicoms", "descriptionAr": null, isHeader: false, isHidden: false },
            { "name": "EMPTY_SPACE2", "description": "for empty space", "descriptionAr": null, isHeader: false, isHidden: true },

            { "name": "Dicoms Uploader", isHeader: true },
            { "name": "DICOMS_UPLOADER", "description": "Upload Dicoms", "descriptionAr": null, isHeader: false, isHidden: false },
            { "name": "EMPTY_SPACE3", "description": "for empty space", "descriptionAr": null, isHeader: false, isHidden: true },

            { "name": "Dicom Viewer", isHeader: true },
            { "name": "DICOM_VIEWER", "description": "View Dicom", "descriptionAr": null, isHeader: false, isHidden: false },
            { "name": "EMPTY_SPACE3", "description": "for empty space", "descriptionAr": null, isHeader: false, isHidden: true },


            { "name": "Application Entites", isHeader: true },
            { "name": "APPICATION_ENTITY_VIEW", "description": "View AE", "descriptionAr": null, isHeader: false, isHidden: false },
            { "name": "APPICATION_ENTITY_EDIT", "description": "Edit AE", "descriptionAr": null, isHeader: false, isHidden: false },
            
            { "name": "Directory Watcher", isHeader: true },
            { "name": "DIRECTORY_WATCHER_VIEW", "description": "View Directory Watcher", "descriptionAr": null, isHeader: false, isHidden: false },
            { "name": "DIRECTORY_WATCHER_EDIT", "description": "Edit Directory Watcher", "descriptionAr": null, isHeader: false, isHidden: false },
            
            { "name": "Users", isHeader: true },
            { "name": "USERS_VIEW", "description": "View Users", "descriptionAr": null, isHeader: false, isHidden: false },
            { "name": "USERS_EDIT", "description": "Edit Users", "descriptionAr": null, isHeader: false, isHidden: false },
        ]
    }

    notPermittedLogin() {
        this.router.navigate(["login"]).then(res => {
            this.presentErrorToast("Sorry, you aren`t permitted to use this website");
        });
    }

    getRouting(name) {
        switch (name) {
            case "DASHBOARD_VIEW":
                return "Dashboard";
            case "GATE_ACCESS_VIEW":
            case "GATE_ACCESS_EDIT":
                return "gateAccess";
            case "ACCESS_CARD_VIEW":
            case "ACCESS_CARD_EDIT":
                return "access-card";
            case "PROJECTS_VIEW":
            case "PROJECTS_EDIT":
                return "projects";
            case "ORDERS_VIEW":
            case "ORDERS_EDIT":
                return "orders";
            case "CUSTOMIZED_ORDERS_VIEW":
            case "CUSTOMIZED_ORDERS_EDIT":
                return "customized-orders";
            case "USERS_VIEW":
            case "USERS_EDIT":
                return "users";
            case "SUBSCRIPTION_VIEW":
            case "SUBSCRIPTION_EDIT":
                return "subscription";
            case "SUBSCRIPTION_CATEGORY_VIEW":
            case "SUBSCRIPTION_CATEGORY_EDIT":
                return "subscription-Catg";
            case "SERVICE_VIEW":
            case "SERVICE_EDIT":
                return "customized-service";
            case "OFFERS_VIEW":
            case "OFFERS_EDIT":
                return "offers";
        }
    }
}