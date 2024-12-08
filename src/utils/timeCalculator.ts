import { ApiISOStringFormException } from "../exceptions";
import { DaysOfWeekNumberType, DaysOfWeekType, DaysOfWeekTypes } from "../types";

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

export const ISOStringToDateOnly = function(ISODateString: string): string {
    const datetime = new Date(ISODateString);
    if (isNaN(datetime.getTime())) throw ApiISOStringFormException;
    return datetime.toISOString().split("T")[0];
}

export const ISOStringToTimeOnlyString = function(ISODateString: string): string {
    const datetime = new Date(ISODateString);
    if (isNaN(datetime.getTime())) throw ApiISOStringFormException;
    return datetime.toISOString().split("T")[1].split("Z")[0];
}

export const daysOfWeekToNumber = function(daysOfWeek: DaysOfWeekType): DaysOfWeekNumberType {
    switch (daysOfWeek) {
        case "Monday": return 1;
        case "Tuesday": return 2;
        case "Wednesday": return 3;
        case "Thursday": return 4;
        case "Friday": return 5;
        case "Saturday": return 6;
        case "Sunday": return 7;
        default: return 1;
    }
}

export const numberToDaysOfWeek = function(daysOfWeekNumber: DaysOfWeekNumberType): DaysOfWeekType {
    // if (daysOfWeekNumber < 1 || daysOfWeekNumber > 7) daysOfWeekNumber = 1;  // we don't have to check since the type does
    return DaysOfWeekTypes[daysOfWeekNumber - 1];
}