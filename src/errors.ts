import { UnprocessableEntity, Unauthorized as BasicUnauthorized } from 'ts-httpexceptions';
import { nameOf, Type } from '@tsed/core';
import { IResponseError } from '@tsed/common';

export class Unauthorized extends BasicUnauthorized implements IResponseError {
  public readonly headers = {
    'WWW-Authenticate': { value: 'Bearer' }
  };
}

export class UnknownPropertyError extends UnprocessableEntity {
  public constructor(target: Type<any>, name: string|symbol) {
    super(`Property ${ name as string } on class ${ nameOf(target) } is not allowed.`);
  }
}

export class RequiredPropertyError extends UnprocessableEntity implements IResponseError {
  public readonly errors: any;

  public constructor(target: Type<any>, name: string|symbol) {
    super(`Property ${ name as string } on class ${ nameOf(target) } is required.`);
    this.errors = [
      {
        dataPath: '',
        keyword: 'required',
        message: `should have required property '${ name as string }'`,
        modelName: nameOf(target),
        params: {
          missingProperty: name
        },
        schemaPath: '#/required'
      }
    ];
  }
}

export class InvalidPropertyError extends UnprocessableEntity {
  public constructor(target: Type<any>, name: string|symbol, value: any) {
    super(`Property ${ name as string } on class ${ nameOf(target) } cannot have value ${ value }.`);
  }
}