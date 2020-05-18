import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { AccessCardContentModel } from "app/models/AccessCardContentModel";
import { AccessCardNumbersModel } from "app/models/AccessCardNumbersModel";

@Injectable({
  providedIn: "root"
})
export class AccessCardService {
  // Base url
  baseurl = "http://localhost:8085";
  token = JSON.parse(sessionStorage.getItem("currentUser"));

  customAccessCard: AccessCardNumbersModel = {};

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

  // GET all access cards
  GetAccessCards(filters): Observable<any> {
    return this.http
      .get<any>(
        this.baseurl +
        "/accessCards/all?page=" +
        filters.page +
        "&size=" +
        filters.size +
        "&ownerName=" +
        filters.ownerName +
        // "&projectId=" +
        filters.projectId +
        "&unitNumber=" +
        filters.unitNumber +
        "&fromDate=" +
        filters.fromDate +
        "&toDate=" +
        filters.toDate +
        "&cardNumber=" +
        filters.cardNumber +
        "&status=" +
        filters.status +
        "&approvedDate=" +
        filters.approvedDate,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  // PUT
  approveAccessWithSerial(
    customCustomerNumbersDataWithId
  ): Observable<AccessCardContentModel> {
    return this.http
      .put<AccessCardContentModel>(
        this.baseurl + "/accessCards/approve",
        customCustomerNumbersDataWithId,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  updateAccessWithSerial(
    customCustomerNumbersDataWithId
  ): Observable<AccessCardContentModel> {
    return this.http
      .put<AccessCardContentModel>(
        this.baseurl + "/accessCards/update",
        customCustomerNumbersDataWithId,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  DeleteAccessCard(id) {
    return this.http
      .delete<AccessCardContentModel>(
        this.baseurl + "/accessCards/" + id + "/forceDelete",
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
    return throwError(errorMessage);
  }
}
