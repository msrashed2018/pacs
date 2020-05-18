
export interface OrderItemsModel {
    id?:             number;
    serviceCatalog?: ServiceCatalog;
}

export interface ServiceCatalog {
    id?:                          number;
    serviceCatalogDescription?:   string;
    serviceCatalogDescriptionAr?: string;
    price?:                       number;
    serviceType?:                 ServiceType;
}

export interface ServiceType {
    id?:                   number;
    serviceDescription?:   string;
    serviceDescriptionAr?: string;
    icon?:                 string;
    allowed24Hours?:       boolean;
    enabled?:              boolean;
}