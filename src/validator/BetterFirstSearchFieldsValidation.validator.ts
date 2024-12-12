import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';

@ValidatorConstraint({ name: 'betterFirstSearchFieldsValidation', async: false })
@Injectable()
export class BetterFirstSearchFieldsValidation implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const { startAfter, endedAt, startCordLongitude, startCordLatitude, endCordLongitude, endCordLatitude } = value;

    const isStartAfterOrEndedAtProvided = !!startAfter || !!endedAt;

    const isStartCordsProvided = !!startCordLongitude && !!startCordLatitude;
    const isEndCordsProvided = !!endCordLongitude && !!endCordLatitude;

    if (!isStartAfterOrEndedAtProvided && !isStartCordsProvided && !isEndCordsProvided) {
      return false;
    }

    if (startAfter && endedAt && new Date(startAfter) >= new Date(endedAt)) {
      return false;
    }

    if (
      (startCordLongitude && !startCordLatitude) ||
      (!startCordLongitude && startCordLatitude) ||
      (endCordLongitude && !endCordLatitude) ||
      (!endCordLongitude && endCordLatitude)
    ) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return `Invalid input: either provide valid 'startAfter'/'endedAt' values or complete 'startCord'/'endCord' pairs.`;
  }
}