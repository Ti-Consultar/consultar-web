export type Permission = {
    id: number,
    name: string
}

export type Member = {
    id: number,
    name: string,
    email: string,
    contact: string,
    permission: Permission
}