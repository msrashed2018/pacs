import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { API_URL } from 'app/config';
import { Patient } from '../models/patient.model';
import { Series } from '../models/series.model';
import { Instance } from '../models/instance.model';
import { Study } from '../models/study.model';
import { PatientFilter } from 'app/models/patient-filter.model';
@Injectable({
  providedIn: 'root'
})
export class DicomsService {

  constructor(
    private http: HttpClient

  ) { }

  getPatients(patientFilterCmd:PatientFilter , page, size, sort) {
    let modalities: string[] = patientFilterCmd.modalities;

    let queryParam: string = `page=${page}&size=${size}&sort=${sort}&`;

    //fill modailities
    for (var _i = 0; _i < modalities.length; _i++) {
      var modality = modalities[_i];
      if (_i != modalities.length - 1) {
        queryParam = queryParam + `modality=${modality}&`
      } else {
        queryParam = queryParam + `modality=${modality}`
      }
    }




    return this.http.get<
    Patient[]>
      (`${API_URL}/dicoms/search?${queryParam}`).pipe(map(
        data => {
          return data;
        }));
  }
  getSerieses(pkTBLPatientID, pkTBLStudyID, pkTBLSeriesID, page, size) {
    return this.http.get<Series[]>
      (`${API_URL}/serieses?pkTBLPatientID=${pkTBLPatientID}&pkTBLStudyID=${pkTBLStudyID}&pkTBLSeriesID=${pkTBLSeriesID}&page=${page}&size=${size}`).pipe(map(
        data => {
          return data;
        }));
  }
  getSeries(pkTBLSeriesID) {
    return this.http.get<Series>
      (`${API_URL}/serieses/${pkTBLSeriesID}`).pipe(map(
        data => {
          return data;
        }));
  }
  getInstance(pkTBLInstanceID) {
    return this.http.get<Instance>
      (`${API_URL}/instances/${pkTBLInstanceID}`).pipe(map(
        data => {
          return data;
        }));
  }
  getStudy(pkTBLInstanceID) {
    return this.http.get<Study>
      (`${API_URL}/studies/${pkTBLInstanceID}`).pipe(map(
        data => {
          return data;
        }));
  }
  getPatient(pkTBLPatientID) {
    return this.http.get<Patient>
      (`${API_URL}/patients/${pkTBLPatientID}`).pipe(map(
        data => {
          return data;
        }));
  }

  uploadDicom(save: boolean, file: File): Observable<HttpEvent<{}>> {
    let formdata: FormData = new FormData();

    formdata.append('file', file);
    const req = new HttpRequest('POST', `${API_URL}/dicoms/upload?save=${save}`, formdata, {
      reportProgress: true,
      // responseType: "text"
    });

    return this.http.request(req);
  }

  uploadDicoms(save: boolean, file: File): Observable<HttpEvent<{}>> {
    let formdata: FormData = new FormData();

    formdata.append('file', file);
    const req = new HttpRequest('POST', `${API_URL}/viewdicom?save=${save}`, formdata, {
      reportProgress: true,
      // responseType: "text"
    });

    return this.http.request(req);
  }
}
