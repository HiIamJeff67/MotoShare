export const isNotEmptyString = function(param: any) {
    return typeof param !== "string" || param.length > 0;
}