import { NumberValueAccessor } from "@angular/forms"

export interface ProjectsModel {

  address?: string;
  addressAr?: string;
  description?: string;
  descriptionAr?: string;
  homeServicesEnabled?: boolean;
  icon?: string;
  id?: number;
  name?: string;
  nameAr?: string;
  numberOfUnits?: NumberValueAccessor;
  securityEnabled?: boolean;
  subscriptionEnabled?: boolean;
  permission?: string;
  enabled?: boolean;
  allUnitsCount?: string;
  activeUnitsCount?: string;
}