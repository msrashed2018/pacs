import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry, filter } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class GateAccessService {
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

  GetAll(page, size, filters) {
    return this.http
      .get(
        this.baseurl +
          "/gate-accesses/all?userName=" +
          filters.userName +
          // "&projectId=" +
          filters.projectId +
          "&unitNumber=" +
          filters.unitNumber +
          "&guestName=" +
          filters.guestName +
          "&fromDate=" +
          filters.fromDate +
          "&toDate=" +
          filters.toDate +
          "&status=" +
          filters.status +
          "&page=" +
          page +
          "&size=" +
          size,
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
