import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {OrderModel} from '../models/OrderModel';
import {catchError, retry} from 'rxjs/operators';
import {DashBoardModel} from '../models/DashboardModel';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {


    // Base url
    baseurl = 'http://localhost:8085';

    // get token fromm storage
    token = JSON.parse(sessionStorage.getItem('currentUser'));

// Http Headers
    httpOptions = {
        headers: new HttpHeaders({
        })
    }

    constructor(private http: HttpClient) {

        this.httpOptions.headers = this.httpOptions.headers.set('Authorization',
            'bearer ' + this.token);

        this.httpOptions.headers = this.httpOptions.headers.set('Content-Type',
            'application/json');
    }

    // GET
    GetAllStates(): Observable<any> {
        return this.http.get<DashBoardModel>(this.baseurl + '/dashboard/stats', this.httpOptions)
            .pipe(
                
                catchError(this.errorHandl)
            )
    }


// Error handling
    errorHandl(error) {
        let errorMessage = '';
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
