

export interface ProperityModel {
    propertyId?:    number;
    ownerName?:     string;
    ownerMobile?:   string;
    ownerIdNumber?: string;
    projectName?:   string;
    unitNumber?:    string;
    status?:        string;
    ownerType?:     string;
    addedDate?:     Date;
    verifiedDate?:  null;
}


export interface ProperityDetailsModel {
    id?:                    number;
    ownerFirstName?:        string;
    ownerMiddleName?:       string;
    ownerLastName?:         string;
    ownerEmail?:            string;
    ownerAddress1?:         string;
    ownerAddress2?:         null;
    ownerID?:               null;
    ownerMobile?:           string;
    number?:                string;
    area?:                  null;
    gardenArea?:            null;
    builtUpArea?:           null;
    floorNumber?:           number;
    numberOfRooms?:         number;
    numberOfParkingSpaces?: number;
    project?:               Project;
}

export interface Project {
    id?:                  number;
    name?:                string;
    nameAr?:              string;
    icon?:                string;
    securityEnabled?:     boolean;
    homeServicesEnabled?: boolean;
    subscriptionEnabled?: boolean;
    description?:         string;
    descriptionAr?:       string;
    address?:             string;
    addressAr?:           string;
    numberOfUnits?:       number;
}