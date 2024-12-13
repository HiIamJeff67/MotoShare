import { TEMP_EMAIL_HEAD, TEMP_EMAIL_TAIL } from "../constants/auth.constant";

export const isTempEmail = function(email: string): boolean {
    const head = email.split('_')[0];
    const splitedEmail = email.split('@');
    const tail = splitedEmail[splitedEmail.length - 1];
    return head === TEMP_EMAIL_HEAD && tail === TEMP_EMAIL_TAIL;
}