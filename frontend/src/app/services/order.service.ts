import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { retry, catchError } from "rxjs/operators";
import { OrderModel } from "../models/OrderModel";

@Injectable({
  providedIn: "root"
})
export class OrderService {
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

  // POST
  CreateOrder(data): Observable<OrderModel> {
    return this.http
      .post<OrderModel>(
        this.baseurl + "/oders/all",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  // GET
  GetAllOrders(filters): Observable<any> {
    return this.http
      .get<OrderModel>(
        this.baseurl +
        "/orders/all?page=" +
        filters.page +
        "&size=" +
        filters.size +
        "&fromDate=" +
        filters.fromDate +
        "&toDate=" +
        filters.toDate +
        "&ownerName=" +
        filters.ownerName +
        "&unitNumber=" +
        filters.unitNumber +
        // "&projectId=" +
        filters.projectId +
        // "&serviceTypeId=" +
        filters.serviceId +
        "&status=" +
        filters.status,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  GetOrder(orderId) {
    return this.http
      .get<OrderModel>(this.baseurl + "/orders/" + orderId, this.httpOptions)
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  // GET
  AssignteOrder(dataObj) {
    return this.http
      .put<OrderModel>(
        this.baseurl + "/orders/assign",
        dataObj,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  // put
  CompleteOrder(orderIdData): Observable<OrderModel> {
    console.log("TOOOKEN => ", this.token);
    return this.http
      .put<any>(
        this.baseurl + "/orders/completeOrder",
        orderIdData,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  RollBackOrder(orderData): Observable<OrderModel> {
    console.log("TOOOKEN => ", this.token);
    return this.http
      .put<any>(
        this.baseurl + "/orders/updateOrderStatus",
        orderData,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  // GET
  GetOrderItems(orderId): Observable<any> {
    return this.http
      .get<OrderModel>(
        this.baseurl + "/orders/" + orderId + "/items",
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  // PUT
  UpdateOrder(id, data): Observable<OrderModel> {
    return this.http
      .put<OrderModel>(
        this.baseurl + "/oders/all" + id,
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  // DELETE
  DeleteOrder(id) {
    return this.http
      .delete<OrderModel>(this.baseurl + "/oders/all" + id, this.httpOptions)
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
