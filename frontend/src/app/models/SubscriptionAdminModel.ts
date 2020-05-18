import { ProperityModel } from "./ProperityModel";
import { SubscriptionItem } from "./SubscriptionItem";

export class SubscriptionAdminModel {

  cancelledDate?: Date;

  discount?: string;

  factor?: number;

  fromDate?: Date;

  subscriptionId?: number;

  item?: SubscriptionItem;

  moreDetails?: string;

  moreDetailsType?: MoreDetailsType;

  property?: ProperityModel;

  unitNumber?: string;

  renewedDate?: Date;

  startType?: StartType;

  status?: Status;

  toDate?: Date;

  requestDate?: Date;

  totalPrice?: number;

  ownerIdNumber?: string;

  ownerMobile?: string;

  ownerName?: string;

  projectName?: string;

  alreadyHasPrice?: boolean = false;

  getTotalGardenArea?: number;
  modifiedDate?: Date;
  modifiedBy?: Date;


}

export enum Status {
  SUBSCRIBED, CANCELLED, PENDING, EXPIRED
}


export enum MoreDetailsType {
  CAR_DETAIL, GARDEN_AREA, SP_AREA
}

export enum StartType {
  FIRST_OF_MONTH, HALF_OF_THE_MONTH
}