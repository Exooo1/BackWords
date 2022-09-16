type StatusType = {
    resultCode: number,
    error: string
}
export type PersonType = {
    _id: string
    auth: number
    password: string
    login: string
    profile: any
}
export const status = (code: number, error: string): StatusType => {
    return {
        resultCode: code,
        error: error,
    }
}