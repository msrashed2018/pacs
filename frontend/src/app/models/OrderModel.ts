
export interface OrderModel {
    orderId?: number;
    userName?: string;
    userMobile?: string;
    userIdNumber?: string;
    projectName?: string;
    unitNumber?: string;
    targetDate?: Date;
    createdDate?: Date;
    canceledDate?: null;
    deliveredDate?: Date;
    assignedDate?: Date;
    totalPrice?: number;
    status?: string;
    rated?: boolean;
    rate?: string;
    comment?: string;
    serviceTypeName?: string;
    technician?: string;
    assignedBy?: string;
    closedBy?: string;
    userId?: string;
}


