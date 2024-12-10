import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsNotEqualTo(property: string, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "isNotEqualTo",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value !== relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const relatedPropertyName = args.constraints[0];
          return `${args.property} should not be equal to ${relatedPropertyName}`;
        },
      },
    });
  };
}