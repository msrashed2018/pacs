import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { retry, catchError } from "rxjs/operators";
import { OrderModel } from "../models/OrderModel";
import { OffersModel } from '../models/OffersModel';

@Injectable({
  providedIn: "root"
})
export class OffersService {
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

  // GET
  GetAllCatgories(): Observable<any> {
    return this.http
      .get<OrderModel>(
        this.baseurl +
        "/offerCategories",
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  // GET
  GetAllMerchants(): Observable<any> {
    return this.http
      .get<OrderModel>(
        this.baseurl +
        "/merchants",
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }


  // GET
  GetAllOffers(filters): Observable<any> {
    return this.http
      .get<OrderModel>(
        this.baseurl +
        "/offers/all?page=" +
        filters.page +
        "&size=" +
        filters.size +
        "&category=" +
        filters.category +
        "&merchant=" +
        filters.merchant +
        "&startDate=" +
        filters.startDate +
        "&endDate=" +
        filters.endDate +
        "&title=" +
        filters.title,
        this.httpOptions
      )
      .pipe(
        
        catchError(this.errorHandl)
      );
  }


  // DELETE
  DeleteOffer(id) {
    return this.http
      .delete<OrderModel>(this.baseurl + "/offers/" + id, this.httpOptions)
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  AddOffer(obj: any) {

    let httpOptions = {
      headers: new HttpHeaders({})
    };

    this.httpOptions.headers = this.httpOptions.headers.set(
      "Authorization",
      "bearer " + this.token
    );

    let data: any = new FormData();
    try {
      data.append("category", obj.category);
      data.append("categoryAr", obj.categoryAr);
      data.append("description", obj.description);
      data.append("descriptionAr", obj.descriptionAr);
      data.append("endDate", obj.endDate);
      data.append("location", obj.location);
      data.append("locationAr", obj.locationAr);
      data.append("merchant", obj.merchant);
      data.append("merchantAr", obj.merchantAr);
      data.append("primaryImage", obj.primaryImageFile);
      data.append("startDate", obj.startDate);
      data.append("termsAndConditions", obj.termsAndConditions);
      data.append("termsAndConditionsAr", obj.termsAndConditionsAr);
      data.append("title", obj.title);
      data.append("titleAr", obj.titleAr);
      data.append("websiteUrl", obj.websiteUrl);
      data.append("websiteUrlAr", obj.websiteUrlAr);

      obj.imagesFiles.forEach((element, index) => {
        data.append("images", element);
      });


      return this.http
        .post<OrderModel>(this.baseurl + "/offers", data, httpOptions)
        .pipe(
          
          catchError(this.errorHandl)
        );
    } catch (ex) {

    }
  }

  // UpdateOffer(obj) {

  //   delete obj.images;
  //   delete obj.primaryImage;
  //   return this.http
  //     .put<OrderModel>(this.baseurl + "/offers/" + obj.id, obj, this.httpOptions)
  //     .pipe(
  //       
  //       catchError(this.errorHandl)
  //     );
  // }


  UpdateOffer(obj) {
    
    let httpOptions = {
      headers: new HttpHeaders({})
    };

    this.httpOptions.headers = this.httpOptions.headers.set(
      "Authorization",
      "bearer " + this.token
    );

    let data: any = new FormData();
    try {
      data.append("category", obj.category);
      data.append("categoryAr", obj.categoryAr);
      data.append("description", obj.description);
      data.append("descriptionAr", obj.descriptionAr);
      data.append("endDate", obj.endDate);
      data.append("location", obj.location);
      data.append("locationAr", obj.locationAr);
      data.append("merchant", obj.merchant);
      data.append("merchantAr", obj.merchantAr);
      data.append("startDate", obj.startDate);
      data.append("termsAndConditions", obj.termsAndConditions);
      data.append("termsAndConditionsAr", obj.termsAndConditionsAr);
      data.append("title", obj.title);
      data.append("titleAr", obj.titleAr);
      data.append("websiteUrl", obj.websiteUrl);
      data.append("websiteUrlAr", obj.websiteUrlAr);

      return this.http
        .put<OrderModel>(this.baseurl + "/offers/" + obj.id, data, httpOptions)
        .pipe(
          
          catchError(this.errorHandl)
        );
    } catch (ex) {

    }
  }

  AddImage(id, file) {

    let httpOptions = {
      headers: new HttpHeaders({})
    };

    this.httpOptions.headers = this.httpOptions.headers.set(
      "Authorization",
      "bearer " + this.token
    );

    let data: any = new FormData();
    data.append("images", file);

    return this.http
      .put<OrderModel>(this.baseurl + "/offers/" + id + "/images", data, httpOptions)
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  UpdatePrimaryImage(id, file) {

    let httpOptions = {
      headers: new HttpHeaders({})
    };

    this.httpOptions.headers = this.httpOptions.headers.set(
      "Authorization",
      "bearer " + this.token
    );

    let data: any = new FormData();
    data.append("image", file);

    return this.http
      .put<OrderModel>(this.baseurl + "/offers/" + id + "/primaryImage", data, httpOptions)
      .pipe(
        
        catchError(this.errorHandl)
      );
  }

  DeleteImage(id, ImageID) {

    let httpOptions = {
      headers: new HttpHeaders({})
    };

    this.httpOptions.headers = this.httpOptions.headers.set(
      "Authorization",
      "bearer " + this.token
    );

    return this.http
      .delete<OrderModel>(this.baseurl + "/offers/" + id + "/images/" + ImageID, httpOptions)
      .pipe(
        
        catchError(this.errorHandl)
      );
  }


  getImage(path) {

    let httpOptions: any = {
      headers: new HttpHeaders({}),
    };

    httpOptions.headers = this.httpOptions.headers.set(
      "Authorization",
      "bearer " + this.token
    );

    httpOptions.headers = this.httpOptions.headers.set(
      "Content-Type",
      "application/json"
    );

    httpOptions.responseType = "arraybuffer";

    return this.http
      .get<any>(
        this.baseurl +
        "/images/getImage?imagePath=" + path,
        httpOptions
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
