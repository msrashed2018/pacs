import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { SystemUserModel, Privilege } from "app/models/SystemUserModel";
import { retry, catchError } from "rxjs/operators";
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: "root"
})
export class ControlUserService {
  // Base url
  baseurl = "http://localhost:8085";

  // get token fromm storage
  token = JSON.parse(sessionStorage.getItem("currentUser"));

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {
    this.httpOptions.headers = this.httpOptions.headers.set(
      "Authorization",
      "bearer " + this.token
    );

    this.httpOptions.headers = this.httpOptions.headers.set(
      "Content-Type",
      "application/json"
    );
    this.httpOptions.params = this.httpOptions.params;
  }

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({}),
    params: new HttpParams({})
  };

  // POST
  CreateUser(data): Observable<SystemUserModel> {
    var encryptedDate = this.authService.Encrypt([
      data.username,
      data.password
    ]);
    data.username = encryptedDate.result[0];
    data.password = encryptedDate.result[1];

    return this.http
      .post<SystemUserModel>(
        this.baseurl + "/registeration",
        data,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  AddUser(data): Observable<SystemUserModel> {
    var encryptedDate = this.authService.Encrypt([
      data.username,
      data.password
    ]);
    var newDate = Object.assign({}, data);
    newDate.username = encryptedDate.result[0];
    newDate.password = encryptedDate.result[1];

    this.httpOptions.params = new HttpParams({});
    return this.http
      .post<any>(this.baseurl + "/users", newDate, this.httpOptions)
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  // GET all Users
  GetUsers(filters): Observable<any> {
    if (!filters.role) {
      this.httpOptions.params = this.httpOptions.params
        .set("role", "ADMIN")
        .append("role", "SECURITY")
        .append("role", "CUSTOMER_SERVICES");
    } else {
      this.httpOptions.params = this.httpOptions.params.set(
        "role",
        filters.role
      );
    }

    let query =
      "/users?page=" +
      filters.page +
      "&size=" +
      filters.size +
      "&name=" +
      filters.firstAndLastName +
      "&reportingManager=" +
      filters.reportingManager +
      "&email=" +
      filters.email +
      "&mobile=" +
      filters.mobile +
      "&registeredDate=" +
      filters.registeredDate;

    if (filters.isEnabled === true || filters.isEnabled === false) {
      query += "&enabled=" + filters.isEnabled;
    }
    return this.http.get<any>(this.baseurl + query, this.httpOptions).pipe(
      
      catchError(this.errorHandl)
    );
  }

  Getuser(userId): Observable<any> {
    return this.http
      .get<any>(this.baseurl + "/users/" + userId, this.httpOptions)
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  GetAllPrivileges(): Observable<any> {
    let httpOptions = this.httpOptions;
    httpOptions.params = new HttpParams({});
    return this.http.get<any>(this.baseurl + "/privileges", httpOptions).pipe(
      
      catchError(this.errorHandl)
    );
  }

  // PUT
  UpdateUser(id, data): Observable<SystemUserModel> {
    return this.http
      .put<SystemUserModel>(
        this.baseurl + "/users/" + id,
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  // DELETE
  DeleteUser(id) {
    return this.http
      .delete<SystemUserModel>(this.baseurl + "/users/" + id, this.httpOptions)
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  // Disable
  DisableUser(id) {
    return this.http
      .put<SystemUserModel>(
        this.baseurl + "/users/" + id + "/disable",
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  // Enable
  EnableUser(id) {
    return this.http
      .put<SystemUserModel>(
        this.baseurl + "/users/" + id + "/enable",
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
