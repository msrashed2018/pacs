import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent
} from "@angular/common/http";

import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { Observable, throwError } from "rxjs";
import { map, catchError, timeout } from "rxjs/operators";
import { Router } from "@angular/router";
import { Globals } from "./globals";

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  callsArr: any = [];
  constructor(private router: Router, private globals: Globals) {}
  headers = new Headers({
    "Content-Type": "application/json",
    Authorization: "bearer " + JSON.parse(sessionStorage.getItem("currentUser"))
  });
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.callsArr.push(1);

    document.getElementById("spinner").style.display = "block";
    let authReq = req.clone();

    if (req.url === "http://localhost:8085/oauth/token") {
      console.log("welcome === >  ", req.url);
    } else {
      authReq = req.clone({
        headers: req.headers.set(
          "Authorization",
          "bearer " + JSON.parse(sessionStorage.getItem("currentUser"))
        )
      });
      // Clone the request to add the new header.
    }

    return next.handle(authReq).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.callsArr.pop();
          if (this.callsArr.length == 0) {
            setTimeout(() => {
              document.getElementById("spinner").style.display = "none";
            }, 100);
          }
        }
        return event;
      }),

      catchError((error: HttpErrorResponse) => {
        this.callsArr.pop();

        if (this.callsArr.length == 0) {
          setTimeout(() => {
            document.getElementById("spinner").style.display = "none";
          }, 100);
        }

        if (error.status == 0) {
          this.globals.presentErrorToast(
            "Connection error, please check your network connection"
          );
          return throwError(error);
        }
        else if (typeof error.error == "string") {
          this.globals.presentErrorToast(error.error);
        } else if (error.error && error.error.message) {
          this.globals.presentErrorToast(error.error.message);
        } else if (error.message && error.message.indexOf("Timeout") > -1) {
          this.globals.presentErrorToast("System error, please try again");
        } else if (error.error && error.error.error_description) {
          this.globals.presentErrorToast(error.error.error_description);
        }

        if (error.status == 403 || error.status == 401) {
          this.router.navigate(["login"]).then(res => {
          });
        }
        return throwError(error);
      })
    );
  }
}
