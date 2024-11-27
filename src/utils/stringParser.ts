export const toBoolean = function(booleanString: string) {
    return booleanString === "true";
}

export const toNumber = function(numberString: string, isPositive: boolean = true) {
    return isPositive ? +numberString : -numberString;
}