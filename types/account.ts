export type AccountTabType = "personal" | "payment";

export interface PersonalInfoFormInterface {
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    urlImage?: string;
}

export interface SecurityFormInterface {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface BankAccountFormInterface {
    bankName: string;
    accountHolder: string;
    accountNumber: string;
    routingNumber: string;
    cardNumber: string;
    expiredDate: string;
}
