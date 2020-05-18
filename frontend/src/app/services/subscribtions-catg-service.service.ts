import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { ServiceItemModel, ServiceTypeModel } from "../models/ServiceTypeModel";

@Injectable({
  providedIn: "root"
})
export class SubscribtionsCatgServiceService {
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

  GetAllSubscribtionCatgTypes(): Observable<ServiceTypeModel> {
    return this.http
      .get<ServiceTypeModel>(
        this.baseurl + "/subscriptionTypes/all?sort=viewOrder,asc",
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  GetSubscribtionCatgItemsbyId(SubscribeCatgId): Observable<ServiceItemModel> {
    return this.http
      .get<ServiceItemModel>(
        this.baseurl + "/subscriptionItems/" + SubscribeCatgId,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }
  GetSubscribtionCatgItems(
    SybscribeCatgTypeId,
    page = 0,
    size
  ): Observable<ServiceItemModel> {
    return this.http
      .get<ServiceItemModel>(
        this.baseurl +
          "/subscriptionItems/all?page=" +
          page +
          "&size=" +
          size +
          "&subscriptionTypeId=" +
          SybscribeCatgTypeId,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  AddItem(dataobj): Observable<ServiceItemModel> {
    return this.http
      .post<ServiceItemModel>(
        this.baseurl + "/subscriptionItems",
        JSON.stringify(dataobj),
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  AddCatgItem(dataobj): Observable<ServiceItemModel> {
    return this.http
      .post<ServiceItemModel>(
        this.baseurl + "/subscriptionTypes",
        JSON.stringify(dataobj),
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  UpdateCatgItem(ItemId, dataobj): Observable<ServiceItemModel> {
    return this.http
      .put<ServiceItemModel>(
        this.baseurl + "/subscriptionTypes/" + ItemId,
        JSON.stringify(dataobj),
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  UpdateItem(ItemId, dataobj): Observable<ServiceItemModel> {
    return this.http
      .put<ServiceItemModel>(
        this.baseurl + "/subscriptionItems/" + ItemId,
        JSON.stringify(dataobj),
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  DeleteSubscribtionCatgItemById(
    subscriptionItemId
  ): Observable<ServiceItemModel> {
    return this.http
      .delete<ServiceItemModel>(
        this.baseurl + "/subscriptionItems/" + subscriptionItemId,
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
