import { isNumberString } from "./isNumberString"

export const isAuthCode = function(authCode: string) {
    return authCode.length === 6 
        && isNumberString(authCode[0]) && isNumberString(authCode[1]) 
        && isNumberString(authCode[2]) && isNumberString(authCode[3]) 
        && isNumberString(authCode[4]) && isNumberString(authCode[5]);
}