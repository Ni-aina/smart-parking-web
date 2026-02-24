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
