import { IgnoreProperty, Property, PropertyType, Required, Email } from '@tsed/common';
import { Indexed, Model, Ref, Unique } from '@tsed/mongoose';
import { Ability, Location } from './types';
import { Exploration } from './exploration';
import { OwnedUnit } from './ownedunit';
import { UnitResult } from './unitresult';

@Model({
  collection: 'explorateurs',
  schemaOptions: {
    strict: 'throw',
    useNestedStrict: true,
    versionKey: false,
    timestamps: false
  }
})
export class Explorateur {
  @IgnoreProperty() public _id = '';
  @Email() @Unique() @Required() public email: string;
  @Unique() @Required() public name: string;
  @IgnoreProperty() public password: string;
  @Indexed() @Property() public location: Location = 'Inoxis';
  @Property() public inox: number = 0;
  @Property() public runes: Map<Ability, number> = new Map<Ability, number>();

  public constructor(email: string, name: string, password: string) {
    this.email = email;
    this.name = name;
    this.password = password;
  }

  public explore(exploration: Exploration) {
    exploration.complete(this, this.location);
    this.location = exploration.to;

    if ((exploration.unit as UnitResult)
      && (exploration.unit as UnitResult).accepted) {
      this.receiveUnit((exploration.unit as UnitResult).unit as OwnedUnit);
    }

    if (exploration.runes && exploration.runes.size) {
      this.receiveRunes(exploration.runes)
    }
  }

  private receiveRunes(runes: Map<Ability, number>) {
    for (const [ability, count] of runes.entries()) {
      this.runes.set(ability, (this.runes.get(ability) || 0) + count);
    }
  }

  private receiveUnit(unit: OwnedUnit) {
    for (const [ability, count] of unit.kernel.entries()) {
      const quantity = this.runes.get(ability) || -1;
      if (count > quantity) {
        throw new Error(`${ this.name } doesn't have ${ count } ${ ability } runes.`);
      }

      this.runes.set(ability, quantity - count);
    }

    unit.capture(this);
  }
}
