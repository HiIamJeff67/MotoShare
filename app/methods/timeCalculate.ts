export const addSeconds = function(second: number, initTime: Date = new Date()): Date {
    return new Date(initTime.getTime() + second * 1000);
}

export const addMinutes = function(minutes: number, initTime: Date = new Date()): Date {
    return new Date(initTime.getTime() + minutes * 60000);
}

export const addHours = function(hours: number, initTime: Date = new Date()): Date {
    return new Date(initTime.getTime() + hours * 3600000);
}

export const addDays = function(days: number, initTime: Date = new Date()): Date {
    return new Date(initTime.getTime() + days * 86400000);
}