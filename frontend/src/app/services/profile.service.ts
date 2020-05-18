import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class ProfileServices {

    // Base url
    baseurl = 'http://localhost:8085';
    token = JSON.parse(sessionStorage.getItem('currentUser'));

    // Http Headers
    httpOptions = {
        headers: new HttpHeaders({
        })
    }


    constructor(private http: HttpClient) {
        this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'bearer ' + this.token);
        this.httpOptions.headers = this.httpOptions.headers.set('Content-Type', 'application/json');

    }

    GetProfile(): Observable<any> {
        return this.http.get<any>(this.baseurl + '/profile', this.httpOptions)
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
        return throwError(errorMessage);
    }


}
