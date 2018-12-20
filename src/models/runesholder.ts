import { PropertyType, IgnoreProperty, Required, Property } from '@tsed/common';
import { Model, } from '@tsed/mongoose';
import { Ability, Weapon } from './types';

@Model({
  collection: 'runesholders',
  schemaOptions: {
    // @ts-ignore
    autoCreate: true,
    autoIndex: true,    
    strict: 'throw',
    useNestedStrict: true,
    versionKey: false,
    timestamps: false
  }
})
export class RunesHolder {
  @IgnoreProperty() public _id: string|undefined;
  @Required() @PropertyType(String) public abilities: Ability[];
  @Required() @PropertyType(String) public weapons: Weapon[];
  @Property() public ultimate: Ability|null;

  public constructor(abilities: Ability[] = [], weapons: Weapon[] = [], ultimate: Ability|null = null) {
    this.abilities = abilities;
    this.weapons = weapons;
    this.ultimate = ultimate;
  }
}
