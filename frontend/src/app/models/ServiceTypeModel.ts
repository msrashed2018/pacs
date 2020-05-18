export interface ServiceTypeModel {
    id?:             number;
    name?:           string;
    nameAr?:         string;
    description?:    string;
    descriptionAr?:  string;
    icon?:           string;
    allowed24Hours?: boolean;
    enabled?:        boolean;
}


export interface ServiceItemModel {
    id?:                          number;
    serviceCatalogDescription?:   string;
    serviceCatalogDescriptionAr?: string;
    price?:                       number;
    enabled?:        boolean;
    serviceType?:                 ServiceTypeModel;
}