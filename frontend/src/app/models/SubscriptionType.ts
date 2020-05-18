

export interface SubscriptionType {
    
    description?: string;
    
    descriptionAr?:	string;
    
    enabled?: boolean;
    
    icon?: string;
    
    id?: number;
    
    name?: string;
    
    nameAr?: string;
    
    serviceCode: ServiceCodeEnum;

}


export interface ServiceCodeEnum {
    C000, C001, C002, C003, C004, C005, C006, C007, C008
}