import { Series } from './series.model';
import { Radiation } from './radiation.model';

export class Instance {
    pkTBLInstanceID : number;
    sopInstanceUID : string;
    sopClassUID : string;
    instanceNumber : number
    patientOrientation : string;
    mediaStorageSopInstanceUID : string;
	transferSyntaxUID : string;
	acquisitionDateTime : string;
    imageType : string;
    pixelSpacing : number
    imageOrientation : string;
    imagePosition : string;
    sliceThickness : string;
    sliceLocation : string;
    windowCenter : string;
    windowWidth : string;
    xrayTubeCurrent : string;
    exposureTime : number;
    kvp : string;
	contentDateTime : string;
    createdDate : string;
    modifiedDate : string;
    radiation: Radiation;
    series : Series;
    image : string;
}
