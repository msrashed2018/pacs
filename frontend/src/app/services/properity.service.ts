import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { retry, catchError } from "rxjs/operators";
import { ProperityModel } from "../models/ProperityModel";

@Injectable({
  providedIn: "root"
})
export class ProperityService {
  // Base url
  baseurl = "http://localhost:8085";

  // get token fromm storage
  token = JSON.parse(sessionStorage.getItem("currentUser"));

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({})
  };

  constructor(private http: HttpClient) { }

  // POST
  CreateProperity(data): Observable<ProperityModel> {
    return this.http
      .post<ProperityModel>(
        this.baseurl +
        "/properties?page=0&size=300&sort=addedDate,desc&status=UNDER_VERIFICATION",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  // GET all properities under verification
  GetAllProperities(filters): Observable<any> {
    this.httpOptions.headers = this.httpOptions.headers.set(
      "Authorization",
      "bearer " + this.token
    );
    return this.http
      .get<any>(
        this.baseurl +
        "/properties?page=" +
        filters.page +
        "&size=" +
        filters.size +
        "&sort=addedDate,asc&status=UNDER_VERIFICATION&ownerIdNumber=" +
        filters.ownerIdNumber +
        "&ownerMobile=" +
        filters.ownerMobile +
        "&ownerName=" +
        filters.ownerName +
        // "&projectId=" +
        filters.projectId +
        "&unitNumber=" +
        filters.unitNumber,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  // GET
  GetProperity(properityId): Observable<any> {
    this.httpOptions.headers = this.httpOptions.headers.set(
      "Authorization",
      "bearer " + this.token
    );
    return this.http
      .get<ProperityModel>(
        this.baseurl + "/properties-details/" + properityId,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  // POST
  CreateProperityDetails(data): Observable<any> {
    return this.http
      .post<ProperityModel>(
        this.baseurl + "/properties-details",
        data,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  GetProperityDetails(projectName, unitNumber): Observable<any> {
    this.httpOptions.headers = this.httpOptions.headers.set(
      "Authorization",
      "bearer " + this.token
    );
    return this.http
      .get<ProperityModel>(
        this.baseurl +
        "/properties-details/findPropertyDetail?projectId=" +
        projectName +
        "&unitNumber=" +
        unitNumber,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  // PUT
  VerifyProperity(data): Observable<ProperityModel> {
    this.httpOptions.headers = this.httpOptions.headers.set(
      "Authorization",
      "bearer " + this.token
    );

    return this.http
      .put<ProperityModel>(
        this.baseurl + "/properties/verify",
        data,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  // PUT
  UpdateProperity(data): Observable<ProperityModel> {
    this.httpOptions.headers = this.httpOptions.headers.set(
      "Authorization",
      "bearer " + this.token
    );
    return this.http
      .put<ProperityModel>(
        this.baseurl + "/properties-details/" + data.id,
        data,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  sendMessage(userId, data): Observable<any> {
    this.httpOptions.headers = this.httpOptions.headers.set(
      "Authorization",
      "bearer " + this.token
    );
    return this.http
      .post<ProperityModel>(
        this.baseurl + "/notifications/sendToUser?userId=" + userId,
        data,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  // DELETE
  DeleteProperity(id) {
    return this.http
      .delete<ProperityModel>(
        this.baseurl + "/properties-details/?propertyDetailId" + id,
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
