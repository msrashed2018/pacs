
import { SubscriptionType } from "./SubscriptionType";

export interface SubscriptionItem {
    
    description?: string;
    
    descriptionAr?: string;
    
    id?: number;
    
    perFactor?: boolean;
    
    perFactorNote?: string;
    
    period?: number;
    
    price?: number;
    
    priceNote?: string;
    
    priceNoteAr?: string;
    
    type?: SubscriptionType;

}