export interface ProfileInterface {
    id: string,
    roles: string[],
    fullName: string,
    emailAddress: string,
    phoneNumber: string,
    urlImage?: string,
    createdAt?: string
}