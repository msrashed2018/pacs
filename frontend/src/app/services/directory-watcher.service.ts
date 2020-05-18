import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'app/config';
import { DirectoryWatcherConfig } from '../directory-watcher/directory-watcher-config.model'

@Injectable({
  providedIn: 'root'
})
export class DirectoryWatcherService {

  constructor( private http:HttpClient) { }
  
  getDirectoryWatcherConfig() {
    return this.http.get<DirectoryWatcherConfig>(`${API_URL}/directory-watcher`);
  }

  manageDirectoryWatcher(directoryWatcherConfig: DirectoryWatcherConfig) {
    return this.http.put<DirectoryWatcherConfig>(`${API_URL}/directory-watcher`, directoryWatcherConfig);
  }
}
