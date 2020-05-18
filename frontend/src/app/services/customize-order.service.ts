import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { retry, catchError } from "rxjs/operators";
import { CustomizeOrderModel } from "../models/CustomizeOrderModel";
import { Response } from '@angular/http';

@Injectable({
  providedIn: "root"
})
export class CustomizeOrdersService {
  // Base url
  baseurl = "http://localhost:8085";

  // get token fromm storage
  token = JSON.parse(sessionStorage.getItem("currentUser"));

  // Http Headers
  httpOptions: any = {
    headers: new HttpHeaders({}),
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
  GetAllOrders(filters): Observable<any> {
    return this.http
      .get<CustomizeOrderModel>(
        this.baseurl +
        "/customizedServices/all?page=" +
        filters.page +
        "&size=" +
        filters.size +
        "&fromDate=" +
        filters.fromDate +
        "&toDate=" +
        filters.toDate +
        "&ownerName=" +
        filters.ownerName +
        "&unitNumber=" +
        filters.unitNumber +
        // "&projectId=" +
        filters.projectId +
        // "&serviceTypeId=" +
        filters.serviceId +
        "&status=" +
        filters.status,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }


  // PUT
  AssignteOrder(dataObj) {
    return this.http
      .put<CustomizeOrderModel>(
        this.baseurl + "/customizedServices/assign",
        dataObj,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  // PUT
  CompleteOrder(dataObj) {
    return this.http
      .put<CustomizeOrderModel>(
        this.baseurl + "/customizedServices/complete",
        dataObj,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  //PUT
  RollBackOrder(dataObj) {
    return this.http
      .put<CustomizeOrderModel>(
        this.baseurl + "/customizedServices/updateStatus",
        dataObj,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }


  getImage(path) {

    let httpOptions: any = {
      headers: new HttpHeaders({}),
    };

    this.httpOptions.headers = this.httpOptions.headers.set(
      "Authorization",
      "bearer " + this.token
    );

    this.httpOptions.headers = this.httpOptions.headers.set(
      "Content-Type",
      "application/json"
    );

    httpOptions.responseType = "arraybuffer";

    return this.http
      .get<any>(
        this.baseurl +
        "/images/getImage?imagePath=" + path,
        httpOptions
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
