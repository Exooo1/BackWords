import {authModel} from "../Auth/authSchema";

type AccountType<T> = {
    value: T
}
export const returnEmailAccount = ({value}: AccountType<string>) => {
    return authModel.findOne({email: value});
}