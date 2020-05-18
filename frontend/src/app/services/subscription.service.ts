import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { SubscriptionAdminModel } from "app/models/SubscriptionAdminModel";
import { Observable, throwError } from "rxjs";
import { catchError, retry, subscribeOn } from "rxjs/operators";
import { SubscriptionIdentifierAndTotalPrice } from "app/models/SubscriptionIdentifierAndTotalPrice";

@Injectable({
  providedIn: "root"
})
export class SubscriptionService {
  baseurl = "http://localhost:8085";
  token = JSON.parse(sessionStorage.getItem("currentUser"));
  subscCustomModel: SubscriptionIdentifierAndTotalPrice = {};

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

  // POST
  Createsubscription(data): Observable<SubscriptionAdminModel> {
    return this.http
      .post<SubscriptionAdminModel>(
        this.baseurl + "/subscriptions",
        data,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandl));
  }

  // GET all subscriptions
  Getsubscriptions(filters): Observable<any> {
    return this.http
      .get<any>(
        this.baseurl +
          "/subscriptions/all?page=" +
          filters.page +
          "&size=" +
          filters.size +
          "&ownerName=" +
          filters.ownerName +
          "&ownerMobile=" +
          filters.ownerMobile +
          // "&projectId=" +
          filters.projectId +
          "&unitNumber=" +
          filters.unitNumber +
          "&fromDate=" +
          filters.fromDate +
          "&toDate=" +
          filters.toDate +
          "&requestDate=" +
          filters.requestDate +
          // "&typeId=" +
          filters.serviceId +
          "&sort=requestDate,desc" +
          "&status=" +
          filters.status,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandl));
  }

  getAllProjects(): Observable<any> {
    return this.http
      .get<any>(this.baseurl + "/ext/projects", this.httpOptions)
      .pipe(catchError(this.errorHandl));
  }

  Getsubscription(subscriptionId): Observable<any> {
    return this.http
      .get<any>(
        this.baseurl + "/subscriptions/" + subscriptionId,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandl));
  }

  getAllServices() {
    return this.http
      .get<any>(this.baseurl + "/subscriptionTypes", this.httpOptions)
      .pipe(catchError(this.errorHandl));
  }

  // PUT
  UpdateSubscription(subscCustomModel): Observable<SubscriptionAdminModel> {
    return this.http
      .put<SubscriptionAdminModel>(
        this.baseurl + "/subscriptions/updateDetails",
        subscCustomModel,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandl));
  }

  // DELETE
  Deletesubscription(id) {
    return this.http
      .delete<SubscriptionAdminModel>(
        this.baseurl + "/subscriptions/" + id,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandl));
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
