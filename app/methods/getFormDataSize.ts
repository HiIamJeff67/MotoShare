export const getFormDataSizeOfEachItem = function(formData: FormData) {
    return Array.from(formData.entries(), ([key, prop]) => ({
        [key]: {
            "ContentLength": 
                typeof prop === "string" 
                    ? prop.length 
                    : prop.size
        }
    }));
}

export const getFormDataTotalSize = function(formData: FormData): number {
    return Array.from(formData.entries())
        .reduce((total, [_, prop]) => 
            total + (typeof prop === "string" ? prop.length : prop.size)
        , 0);
}