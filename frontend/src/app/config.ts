var EnablePrivilage = false;
export const NO_DATA_FOUND = "NO DATA DOUND"
export const PATIENTS_PAGE_SIZE= 5;
export const PATIENTS_PAGE_SORT= "patientName,asc";
export const API_URL = "http://localhost:8085";
export const MAX_DICOM_FILE_UPLOAD_SIZE=5000000 //5 MB

import { Injectable } from '@angular/core';

@Injectable()
export class ConfigClass {

  public static get getPrivilageStatus() {
    return EnablePrivilage;
  }
  
  public static set setPrivilageStatus(val) {
    EnablePrivilage = val;
  }

}

export enum EditPrivilege {
  APPICATION_ENTITY_EDIT = "APPICATION_ENTITY_EDIT",
  DIRECTORY_WATCHER_EDIT = "DIRECTORY_WATCHER_EDIT",
  USERS_EDIT = "USERS_EDIT",
  DICOMS_UPLOADER = "DICOMS_UPLOADER",
  SUBSCRIPTION_EDIT = "SUBSCRIPTION_EDIT",
  SUBSCRIPTION_CATEGORY_EDIT = "SUBSCRIPTION_CATEGORY_EDIT",
  GATE_ACCESS_EDIT = "GATE_ACCESS_EDIT",
  ACCESS_CARD_EDIT = "ACCESS_CARD_EDIT",
  PROJECTS_EDIT = "PROJECTS_EDIT",
  PROPERTY_EDIT = "PROPERTY_EDIT",
  ORDERS_EDIT = "ORDERS_EDIT",
  CUSTOMIZED_ORDERS_EDIT = "CUSTOMIZED_ORDERS_EDIT",
  
  SERVICE_EDIT = "SERVICE_EDIT",
  OFFERS_EDIT = "OFFERS_EDIT",
  
}

export enum ViewPrivilege {
  DICOMS_SEARCH = "DICOMS_SEARCH",
  DICOM_VIEWER = "DICOM_VIEWER",
  DIRECTORY_WATCHER_VIEW= "DIRECTORY_WATCHER_VIEW",
  APPICATION_ENTITY_VIEW = "APPICATION_ENTITY_VIEW",
  
  SUBSCRIPTION = "SUBSCRIPTION",
  SUBSCRIPTION_CATEGORY = "SUBSCRIPTION_CATEGORY",
  GATE_ACCESS = "GATE_ACCESS",
  ACCESS_CARD = "ACCESS_CARD",
  PROJECTS = "PROJECTS",
  PROPERTY = "PROPERTY",
  ORDERS = "ORDERS",
  CUSTOMIZED_ORDERS = "CUSTOMIZED_ORDERS",
  USERS = "USERS",
  SERVICE = "SERVICE",
  OFFERS = "OFFERS",
  DASHBOARD = "DASHBOARD"
}
