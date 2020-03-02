import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DirectoryWatcherService } from './directory-watcher.service';
import { DirectoryWatcherConfig } from './directory-watcher-config.model';

@Component({
  selector: 'app-directory-watcher',
  templateUrl: './directory-watcher.component.html',
  styleUrls: ['./directory-watcher.component.scss']
})
export class DirectoryWatcherComponent implements OnInit {

  watcher: DirectoryWatcherConfig = new DirectoryWatcherConfig();
  message: string = "";
  enableChange: boolean = false;
  constructor(
    private directoryWatcherService: DirectoryWatcherService,

  ) { }

  ngOnInit() {
    this.refreshData();
  }
  refreshData() {
    this.directoryWatcherService.getDirectoryWatcherConfig()
      .subscribe(
        result => {
          this.watcher = result;
          this.enableChange = this.watcher.enabled;
        }
      );
  }

  onSave() {
    this.directoryWatcherService.manageDirectoryWatcher(this.watcher)
      .subscribe(

        result => {
          this.message = "Configuration Saved Successfuly";
          this.refreshData();
        },
        error => {
          this.message = error.error.message;
        }
      );
  }

  checkValue(event){
    this.enableChange = event.currentTarget.checked;
  }
}
