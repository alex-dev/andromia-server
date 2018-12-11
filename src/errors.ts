import { nameOf, Type } from '@tsed/core';
import { UnprocessableEntity } from 'ts-httpexceptions';
import { IResponseError } from '@tsed/common';

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