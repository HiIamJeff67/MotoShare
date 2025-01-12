export const getLimitString = function(str: string, limit: number) {
    return str.slice(0, Math.max(0, limit)) + (str.length > limit ? "..." : "");
}