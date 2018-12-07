import { IConverter, Converter } from '@tsed/common';
import { UnprocessableEntity } from 'ts-httpexceptions';
import { Rune, Ability, Weapon } from '../models/rune';

@Converter(Ability, Weapon)
export class RuneConverter implements IConverter {
  public deserialize(data: string, target: any): Rune {
    switch (target) {
      case Ability: return new Ability(data);
      case Weapon: return new Weapon(data);
      default: throw new UnprocessableEntity('Could not process Rune in JSON schema.');
    }
  }

  public serialize(object: Rune): any {
    return object.name;
  }
}