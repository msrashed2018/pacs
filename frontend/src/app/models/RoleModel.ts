
export interface RoleModel {

    id?: number;
    name?: RoleEnum;
}



export enum RoleEnum {
    // ADMIN = "ADMIN",
    // SECURITY = "SECURITY",
    // CUSTOMER_SERVICES = "CUSTOMER_SERVICES",
    USER = "USER",
}

export enum UserRulesDisplayNames {
    // ADMIN = "Business User",
    // CUSTOMER_SERVICES = "Agent",
    // SECURITY = "Security",
    USER = "User"
}