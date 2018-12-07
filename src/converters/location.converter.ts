import { IConverter, Converter } from '@tsed/common';
import { UnprocessableEntity } from 'ts-httpexceptions';
import { Location } from '../models/location';

@Converter(Location)
export class LocationConverter implements IConverter {
  public deserialize(data: string, target: any): Location {
    switch (target) {
      case Location: return new Location(data);
      default: throw new UnprocessableEntity('Could not process Set in JSON schema.');
    }
  }

  public serialize(object: Location): any {
    return object.name;
  }
}