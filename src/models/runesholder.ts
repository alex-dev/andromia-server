import { IgnoreProperty, Required } from '@tsed/common';
import { Model, } from '@tsed/mongoose';
import { Ability, Weapon } from './types';

@Model({
  collection: 'runesholders',
  schemaOptions: {
    strict: 'throw',
    useNestedStrict: true,
    versionKey: false,
    timestamps: false
  }
})
export class RunesHolder {
  @IgnoreProperty() public _id = '';
  @Required() public abilities: Ability[];
  @Required() public weapons: Weapon[];

  public constructor(abilities: Ability[] = [], weapons: Weapon[] = []) {
    this.abilities = abilities;
    this.weapons = weapons;
  }
}
