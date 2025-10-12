export interface ProfileInterface {
    id: string,
    roles: string[],
    fullName: string,
    emailAddress: string,
    phoneNumber: string,
    urlImage?: string,
    createdAt?: string
}

export interface AgentsInterface {
    id: string,
    name: string,
    urlImage: string,
    checked: boolean
}