export const toUTCPlusN = function(date: Date, n: number = 8): Date {
    return new Date(date.setUTCHours(date.getUTCHours() + n));
}