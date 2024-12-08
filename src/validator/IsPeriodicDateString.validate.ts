import { registerDecorator, ValidationOptions } from 'class-validator';

// a periodic date string is defined as "9999-12-31THH:MM:SS.MSZ" HH: hours, MM: minutes, SS: seconds, MS: miliseconds
export function IsPeriodicDateString(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsPeriodicDateString',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: `${propertyName} must be this form of date: 9999-12-31THH:MM:SS.MSZ, since for periodic datetime, it only considers the time excluded its date.`, 
        ...validationOptions, 
      },
      validator: {
        validate(value: any) {
            const regex = /^9999-12-31T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;
            return (
                typeof value === 'string' && 
                regex.test(value)
            );
        },
      },
    });
  };
}
