import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { ServiceItemModel, ServiceTypeModel } from "../models/ServiceTypeModel";

@Injectable({
  providedIn: "root"
})
export class CustomizedServices {
  // Base url
  baseurl = "http://localhost:8085";

  // get token fromm storage
  token = JSON.parse(sessionStorage.getItem("currentUser"));

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({})
  };

  constructor(private http: HttpClient) {
    this.httpOptions.headers = this.httpOptions.headers.set(
      "Authorization",
      "bearer " + this.token
    );

    this.httpOptions.headers = this.httpOptions.headers.set(
      "Content-Type",
      "application/json"
    );
  }

  // GET

  GetAllServiceTypes(): Observable<ServiceTypeModel> {
    return this.http
      .get<ServiceTypeModel>(this.baseurl + "/serviceTypes", this.httpOptions)
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  GetServiceItems(serviceTypeId, page, size): Observable<ServiceItemModel> {
    return this.http
      .get<ServiceItemModel>(
        this.baseurl +
          "/serviceTypes/" +
          serviceTypeId +
          "/servicesCatalog/all?page=" +
          page +
          "&size=" +
          size,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  GetServiceItemsById(
    serviceTypeId,
    serviceItemId
  ): Observable<ServiceItemModel> {
    return this.http
      .get(
        this.baseurl +
          "/serviceTypes/" +
          serviceTypeId +
          "/servicesCatalog/" +
          serviceItemId,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  AddServiceTypeItem(serviceTypeId, dataobj): Observable<ServiceItemModel> {
    return this.http
      .post<ServiceItemModel>(
        this.baseurl + "/serviceTypes/" + serviceTypeId + "/servicesCatalog",
        JSON.stringify(dataobj),
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  UpdateServiceTypeItem(
    serviceTypeId,
    serviceItemId,
    dataobj
  ): Observable<ServiceItemModel> {
    return this.http
      .put<ServiceItemModel>(
        this.baseurl +
          "/serviceTypes/" +
          serviceTypeId +
          "/servicesCatalog/" +
          serviceItemId,
        JSON.stringify(dataobj),
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  DeleteServiceItemById(
    serviceTypeId,
    serviceItemId
  ): Observable<ServiceItemModel> {
    return this.http
      .delete<ServiceItemModel>(
        this.baseurl +
          "/serviceTypes/" +
          serviceTypeId +
          "/servicesCatalog/" +
          serviceItemId,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  // Error handling
  errorHandl(error) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
