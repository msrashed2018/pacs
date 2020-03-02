import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationEntity } from './application-entity.model';
import { API_URL } from 'app/config';

@Injectable({
  providedIn: 'root'
})
export class ApplicationEntityService {

  constructor(
    private http:HttpClient
  ) { }

  retrieveApplicationEntities(page,size) {
    return this.http.get<ApplicationEntity[]>(`${API_URL}/application-entities?page=${page}&size=${size}`);
  }

  deleteApplicationEntity(id){
    return this.http.delete(`${API_URL}/application-entities/${id}`);
  }

  retrieveApplicationEntity(id){
    return this.http.get<ApplicationEntity>(`${API_URL}/application-entities/${id}`);
  }

  updateApplicationEntity(id, applicationEntity){
    return this.http.put(
          `${API_URL}/application-entities/${id}`
                , applicationEntity);
  }

  createApplicationEntity(applicationEntity){
    return this.http.post(
              `${API_URL}/application-entities`
                , applicationEntity);
  }


  startApplicationEntity(id){
    return this.http.put(`${API_URL}/application-entities/${id}/start`, null);
  }

  stopApplicationEntity(id){
    return this.http.put(`${API_URL}/application-entities/${id}/stop`, null);
  }
}
