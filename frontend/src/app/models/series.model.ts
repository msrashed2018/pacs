import { Study } from './study.model';
import { Instance } from './instance.model';
import { Equipment } from './equipment.model';

export class Series {
    pkTBLSeriesID : Number;
    seriesInstanceUID : string;
    seriesNumber : number;
    seriesDescription : string;
    bodyPartExamined : string;
    patientPosition : string;
    laterality : string;
    protocolName : string;
    operatorsName : string;
	seriesDateTime : string;
	createdDate : string;
	modifiedDate : string;
    study : Study;
    equipment : Equipment;
    instances : Instance[];
}
