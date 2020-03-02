import { Series } from './series.model';

export class Equipment {
    pkTBLEquipmentID : number;
    modality : string;
    conversionType : string;
    stationName : string;
    institutionName : string;
    institutionAddress : string;
    institutionalDepartmentName : string;
    manufacturer : string;
    manufacturerModelName : string;
    softwareVersion : string;
    deviceSerialNumber : string;
    createdDate : string;
    modifiedDate : string;
	series : Series;
}
