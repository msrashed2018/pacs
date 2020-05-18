import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { ServiceItemModel, ServiceTypeModel } from "../models/ServiceTypeModel";

@Injectable({
  providedIn: "root"
})
export class CategoriesSubscribtionService {
  baseurl = "http://localhost:8085";

  // get token fromm storage
  token = JSON.parse(localStorage.getItem("currentUser"));

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

  GetAllSubscribtionCatgTypes(): Observable<ServiceTypeModel> {
    return this.http
      .get<ServiceTypeModel>(
        this.baseurl + "/subscriptionTypes",
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
