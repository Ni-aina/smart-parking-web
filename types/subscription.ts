export interface SubscriptionPlanInterface {
    id: string;
    name: string;
    price: number;
    features: string[];
    popular: boolean;
    isActive: boolean;
    createdAt: string;
}

export interface SubscriptionInterface {
    id: string;
    ownerId: string;
    planId: string;
    plan?: SubscriptionPlanInterface;
    cardLastFour: string;
    status: "active" | "cancelled" | "expired";
    startDate: string;
    endDate: string;
    createdAt: string;
}

export interface SubscriptionStateInterface {
    error: string | null;
    success: string | null;
}
