import { RoleModel } from "./RoleModel";


export interface SystemUserModel {

    username?: string;
    password?: string;
    firstname?: string;
    lastname?: string;
    mobile?: string;
    id?: number;
    email?: string;
    age?: number;
    intMobile?: string;
    gender?: Gender;
    birthdate?: Date;
    roles?: RoleModel[];
    annualIncome?: number;
    idNumber?: string;
    passportNumber?: string;
    registeredDate?: Date;
    enabled?: boolean,
    isEnabled?: String,
    privileges?: any,
    reportingManager?: string;
}


export enum Gender {
    MALE, FEMALE, UNSPECIFIED
}

export class Privilege {
    id?: number;
    name?: string;
    description?: string;
    descriptionAr?: string;
    checked?: boolean;
    isHeader?: boolean;
}