export const isHexColorString = function(hexColorString: string) {
    return hexColorString[0] === '#' && hexColorString.length <= 7;
}