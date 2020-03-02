import { Study } from './study.model';

export class Patient {
    pkTBLPatientID : number;
    patientID : string;
    patientName : string;
    patientSex : string;
    patientBirthday : string;
    patientAge : string;
    createdDate : string;
    modifiedDate : string;
    studies : Study[];
}
