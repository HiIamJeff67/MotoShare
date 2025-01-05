import { DaysOfWeekNumberType, DaysOfWeekType } from "../types";
export declare const addSeconds: (second: number, initTime?: Date) => Date;
export declare const addMinutes: (minutes: number, initTime?: Date) => Date;
export declare const addHours: (hours: number, initTime?: Date) => Date;
export declare const addDays: (days: number, initTime?: Date) => Date;
export declare const ISOStringToDateOnly: (ISODateString: string) => string;
export declare const ISOStringToTimeOnlyString: (ISODateString: string) => string;
export declare const daysOfWeekToNumber: (daysOfWeek: DaysOfWeekType) => DaysOfWeekNumberType;
export declare const numberToDaysOfWeek: (daysOfWeekNumber: DaysOfWeekNumberType) => DaysOfWeekType;
