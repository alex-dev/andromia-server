import { IConverter, Converter } from '@tsed/common';
import { UnprocessableEntity } from 'ts-httpexceptions';
import { Set } from '../models/set';

@Converter(Set)
export class SetConverter implements IConverter {
  public deserialize(data: string, target: any): Set {
    switch (target) {
      case Set: return new Set(data);
      default: throw new UnprocessableEntity('Could not process Set in JSON schema.');
    }
  }

  public serialize(object: Set): any {
    return object.name;
  }
}