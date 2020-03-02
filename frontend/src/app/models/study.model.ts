import { Patient } from './patient.model';
import { Series } from './series.model';

export class Study {
    pkTBLStudyID : number;
    studyID : string;
    studyDescription : string;
    studyInstanceUID : string;
    accessionNumber : string;
    studyDateTime : string;
    referringPhysicianName : string;
    additionalPatientHistory : string;
    admittingDiagnosesDescription : string;
    studyStatusID : string;
    studyPriorityID : string;
    createdDate : string;
    modifiedDate : string;
    patient : Patient;
    serieses : Series[];
}
