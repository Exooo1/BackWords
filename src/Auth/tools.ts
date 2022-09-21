type StatusType = {
    resultCode: number
    error: string
    message: string
}
export type AccountType ={
    _id:string
    verify:number
    auth:number
    email:string
    password:string
}
export type PersonType = {
    _id:string
    verify: number
    auth: number
    email: string
    password: string
    profile: any
}
export const status = (code: number, error: string, message?: string): StatusType => {
    return {
        resultCode: code,
        error, message
    }
}
