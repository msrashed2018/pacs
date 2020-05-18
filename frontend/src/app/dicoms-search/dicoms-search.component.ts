import { Component, OnInit, ViewChild } from '@angular/core';
import { Patient } from 'app/models/patient.model';
import { ConfigClass, ViewPrivilege } from 'app/config';
import { DicomsService } from 'app/services/dicoms.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MultipleDicomsViewComponent } from 'app/shared/multiple-dicoms-view/multiple-dicoms-view.component';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { Globals } from 'app/globals';
import { ConfirmationComponent } from 'app/confirmation/confirmation.component';
import { TableUtil } from 'app/models/TableUtil';
@Component({
  selector: 'app-dicoms-search',
  templateUrl: './dicoms-search.component.html',
  styleUrls: ['./dicoms-search.component.css']
})
export class DicomsSearchComponent implements OnInit {
  displayedColumns: string[] = [
    "select",
    "patientID",
    "patientName",
    "sex",
    "birthday",
    "age",
    "createdDate",
    "merge",
    "exportExcel"
  ];
  dataSource: MatTableDataSource<Patient> = new MatTableDataSource();
  selection = new SelectionModel<Patient>(true, []);
  patients: Patient[] = [];
  totalPages = 0;
  createdDate;
  modalities = [{ name: "CT" }, { name: "MG" }, { name: "PT" }, { name: "XA" }, { name: "ES" }];
  sortx = "patientName,asc";
  page = 0;
  size = 20;
  filters = {
    modality: "",
    modalities: [],
    patientName: "",
    gender: "",
    patientId: "",
    instituitionName: "",
    physician: "",
    fromDate: "",
    toDate: "",
    page: 0,
    size: 20
  };
  genders: any = [
    { description: "Male", name: "M" },
    { description: "Female", name: "F" }
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private dicomService: DicomsService,
    private router: Router,
    private globals: Globals
  ) { }

  ngOnInit(): void {

    this.getData();
    this.checkPrivilage();
    this.dataSource.sort = this.sort;


  }
  onCreatedDateChanged() {
    // this.filters.fromDate = "";
    // this.filters.toDate = "";

    var today = new Date();

    if (this.createdDate == "today") {
      this.filters.fromDate = today.toUTCString();
      this.filters.toDate = today.toUTCString();
    } else if (this.createdDate == "lastweek") {

      var lastweek = new Date();
      lastweek.setDate(today.getDate() - 7);
      this.filters.fromDate = lastweek.toUTCString();
      this.filters.toDate = today.toUTCString();

    } else if (this.createdDate == "lastmonth") {
      var lastmonth = new Date();
      lastmonth.setMonth(today.getMonth() - 1);
      this.filters.fromDate = lastmonth.toUTCString();
      this.filters.toDate = today.toUTCString();
    }

    this.getData();
  }
  onFromToDateChanged() {
    this.createdDate = "";
  }
  checkPrivilage() {
    if (ConfigClass.getPrivilageStatus) {
      let willShow = false;
      let privilage = JSON.parse(sessionStorage.getItem("privilage"));
      privilage.forEach(element => {
        if (element.name == ViewPrivilege.DICOMS_SEARCH) {
          this.displayedColumns.push();
          willShow = true;
        }
      });
      if (!willShow) {
        this.router.navigate(["dashboard"]);
      }
    } else {
      this.displayedColumns.push();
    }
  }

  resetFilters() {
    this.createdDate = "";
    this.filters = {
      modality: "",
      modalities: [],
      patientName: "",
      gender: "",
      patientId: "",
      instituitionName: "",
      physician: "",
      fromDate: "",
      toDate: "",
      page: 0,
      size: 20
    };
    this.getData();
  }



  // export() {
  //   TableUtil.exportToExcel(
  //     document.getElementById("gateAccess-table"),
  //     "Gate Access"
  //   );
  // }

  getData() {
    if (this.filters.fromDate && this.filters.toDate) {
      var date = new Date(this.filters.fromDate);
      let month = date.getMonth() + 1;
      let day = date.getDate();
      this.filters.fromDate =
        date.getFullYear() +
        "-" +
        (month.toString().length > 1 ? month : "0" + month) +
        "-" +
        (day.toString().length > 1 ? day : "0" + day);

      var date2 = new Date(this.filters.toDate);
      let month2 = date2.getMonth() + 1;
      let day2 = date2.getDate();
      this.filters.toDate =
        date2.getFullYear() +
        "-" +
        (month2.toString().length > 1 ? month2 : "0" + month2) +
        "-" +
        (day2.toString().length > 1 ? day2 : "0" + day2);
    }

    this.filters.modality = "";
    this.filters.modalities.forEach(element => {
      this.filters.modality += "&modality=" + element;
    });



    this.dicomService.getPatients(this.filters, this.page, this.size, this.sortx).subscribe(
      results => {

        this.patients = results['content'];
        this.dataSource.data = this.patients;



        this.totalPages = results["totalPages"];
      }
    );

    this.selection.clear();
  }

  openViewDialog(patient): void {
    let patients: Patient[] = [];
    patients.push(patient)
    const dialogRef = this.dialog.open(MultipleDicomsViewComponent, {
      width: "1300px",
      height: "900px",
      disableClose: false,
      autoFocus: true,

      data: {
        patients: patients
      }
    });
    dialogRef.afterClosed().subscribe(fetchedData => {
      if (fetchedData) {
        this.getData();
      }
    });
  }

  pagination(type) {
    if (type == "next") {
      if (this.filters.page + 1 <= this.totalPages) {
        this.filters.page += 1;
        this.getData();
      }
    } else if (type == "back") {
      if (this.filters.page - 1 > -1) {
        this.filters.page -= 1;
        this.getData();
      }
    } else if (type == "last") {
      this.filters.page = this.totalPages - 1;
      this.getData();
    } else if (type == "first") {
      this.filters.page = 0;
      this.getData();
    }
  }

  onPageChange(size) {
    if (this.size != size) {
      this.size = Number(size);
      this.filters.page = 0;
      this.getData();
    }
  }



  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Patient): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.patientID + 1}`;
  }


  mergePatient(patient) {

    let selectedPatients: Patient[] = this.selection.selected;

    console.log( selectedPatients.length);
    

    if (selectedPatients.find(element => element == patient) && selectedPatients.length > 1) {

      let msg = "Are you sure to merge below patients?";

      let msgList: string[] = ["[" + patient.patientName + "]"];

      let patientIDs: string[] = [];

      selectedPatients.forEach((selectedPatient)=> {

        if (selectedPatient.patientID != patient.patientID) {
          msgList.push(selectedPatient.patientName);
          patientIDs.push(selectedPatient.patientID)
        }
      });

      const dialogRef = this.dialog.open(ConfirmationComponent, {
        width: "500px",
        disableClose: false,
        autoFocus: false,
        data: { msg, msgList }
      });
      dialogRef.afterClosed().subscribe(fetchedData => {
        if (fetchedData) {
          this.dicomService.mergePatient(patient.patientID, patientIDs).subscribe(
            results => {
              this.deleteMergedPatients(patientIDs);
            }
          );
        }
      });

    }
    else {
      window.alert("Please select the patients you want to merge");
    }

  }

  deleteMergedPatients(patientIDs: string[]) {

    patientIDs.forEach((patientID) => {
      this.dicomService.deletePatient(patientID).subscribe(

        result =>{

        }
      );


      this.getData();

      
    });

  }

  exportPatient(patient: Patient) {
    let patients : Patient[] = [];
    patients.push(patient);
    var table = document.getElementById("patients-table");
    var tempTable: any = table.cloneNode(true);
    var cellIndex = tempTable.rows[0].cells.length;
    for (var i = 0; i < tempTable.rows.length; i++) {
      tempTable.rows[i].deleteCell(cellIndex - 1);
    }
    // TableUtil.exportToExcel(tempTable, "Patients");
    TableUtil.exportPatientsAsExcelFile(patients, "Patients");
  }

  export() {
    var table = document.getElementById("patients-table");
    var tempTable: any = table.cloneNode(true);
    var cellIndex = tempTable.rows[0].cells.length;
    for (var i = 0; i < tempTable.rows.length; i++) {
      tempTable.rows[i].deleteCell(cellIndex - 1);
    }
    // TableUtil.exportToExcel(tempTable, "Patients");
    TableUtil.exportPatientsAsExcelFile(this.patients, "Patients");
  }
 
}
