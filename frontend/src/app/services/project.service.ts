import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { retry, catchError } from "rxjs/operators";
import { ProjectsModel } from "app/models/ProjectsModel";

@Injectable({
  providedIn: "root"
})
export class ProjectService {
  // Base url
  baseurl = "http://localhost:8085";

  // get token fromm storage
  token = JSON.parse(sessionStorage.getItem("currentUser"));

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

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({})
  };

  // POST
  CreateProject(data): Observable<ProjectsModel> {
    return this.http
      .post<ProjectsModel>(this.baseurl + "/projects", data, this.httpOptions)
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  // GET all projects
  GetProjects(filter): Observable<any> {
    var data = "page=" + filter.page + "&size=" + filter.size;

    if (filter.homeServicesEnabled_notactive) {
      data += "&homeServicesEnabled=false"
    }
    else if (filter.homeServicesEnabled) {
      data += "&homeServicesEnabled=true"
    }

    if (filter.securityEnabled_notactive) {
      data += "&securityEnabled=false"
    }
    else if (filter.securityEnabled) {
      data += "&securityEnabled=true"
    }

    if (filter.subscriptionEnabled_notactive) {
      data += "&subscriptionEnabled=false"
    }
    else if (filter.subscriptionEnabled) {
      data += "&subscriptionEnabled=true"
    }

    if (filter.enabled_notactive) {
      data += "&enabled=false"
    }
    else if (filter.enabled) {
      data += "&enabled=true"
    }

    return this.http
      .get<any>(
        this.baseurl + "/projects?" + data,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  GetProject(projectId): Observable<any> {
    return this.http
      .get<any>(this.baseurl + "/projects/" + projectId, this.httpOptions)
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  // PUT
  UpdateProject(data): Observable<ProjectsModel> {
    return this.http
      .put<ProjectsModel>(
        this.baseurl + "/projects/" + data.id,
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  // DELETE
  DeleteProject(id) {
    return this.http
      .delete<ProjectsModel>(this.baseurl + "/projects/" + id, this.httpOptions)
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
