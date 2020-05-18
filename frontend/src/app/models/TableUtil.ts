
import * as XLSX from "xlsx";
import { Patient } from "./patient.model";
import { Study } from "./study.model";
import { Series } from "./series.model";
import { Instance } from "./instance.model";

export class TableUtil {
  static exportToExcel(table, name?: string) {
    let timeSpan = new Date().toISOString();
    // let prefix = name || "ExportResult";
    let prefix = name || "ExportResult";
    let fileName = `${prefix}-${timeSpan}`;
    let wb = XLSX.utils.table_to_book(table, <XLSX.Table2SheetOpts>{ sheet: prefix });
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }


  static exportPatientsAsExcelFile(patients: Patient[], excelFileName: string): void {
    let workbook: XLSX.WorkBook = XLSX.utils.book_new();


    const patientSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(patients);

    XLSX.utils.book_append_sheet(workbook, patientSheet, "Patients");

    let studies: Study[] = [];
    let serieses: Series[] = [];
    let instances: Instance[] = [];
    patients.forEach((patient) => {
      patient.studies.forEach((study) => {
        studies.push(study)
        study.serieses.forEach((series) => {
          serieses.push(series);
          series.instances.forEach((instance) => {
            instances.push(instance);
          });
        });
      });
    });

    
    
    const studiesSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(studies);
    const seriesesSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(serieses);
    const instancesSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(instances);

    XLSX.utils.book_append_sheet(workbook, studiesSheet, "Studies");

    XLSX.utils.book_append_sheet(workbook, seriesesSheet, "Serieses");

    XLSX.utils.book_append_sheet(workbook, instancesSheet, "Instances");

    // let studySheet: XLSX.WorkSheet;

    // for (var _i = 0; _i < patients.length; _i++) {
    //     if(_i == 0){
    //       studySheet = XLSX.utils.json_to_sheet(patients[_i].studies);
    //     }else{
    //       XLSX.utils.sheet_add_json(studySheet,patients[_i].studies, <XLSX.SheetAOAOpts>{  skip });
    //     }
    // }

    // XLSX.utils.book_append_sheet(workbook, studySheet,"Studies");

    // workbook = { Sheets: { 'Patient': patientSheet, 'Study': studySheet }, SheetNames: ['Patient', 'Study'] };


    // const studySheet: XLSX.WorkSheet = XLSX.utils.book_append_sheet(workbook,patients, '')
    XLSX.writeFile(workbook, `${excelFileName}.xlsx`);
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    // const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    // FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  }
}