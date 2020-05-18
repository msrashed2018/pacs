import { ProjectsModel } from "./ProjectsModel"

export interface AccessCardContentModel {

    accessCardId?: number;
    ownerName?: string;
    ownerMobile?: string;
    ownerIdNumber?: number;
    projectName?: string;
    unitNumber?: string;
    cardNumber1?: string;
    cardNumber2?: string;
    approvedDate?: Date;
    approvedBy?: string;
    free?: boolean;
    property?: property;
    requestDate?: Date;
    status?: Status;
    toDate?: Date;
    fromdate?: Date;
    modifiedDate?: Date;
    modifiedBy?: Date;
    licenseFrontImage?: string;
    licenseBackImage?: string;
}


export interface property {
    addedDate?: Date;
    homeaway?: HomeAway;
    id?: number;
    number?: string;
    ownerType?: OwnerType;
    project?: ProjectsModel;
    status?: PropertyStatus;
    verifiedDate?: Date;
}


export enum Status {
    PENDING, APPROVED
}

export enum OwnerType {
    TENANT, OWNER
}

export enum PropertyStatus {
    UNDER_VERIFICATION, HANDED_OVER
}

export enum HomeAway {
    HOME, AWAY, NA
}