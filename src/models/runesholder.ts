import { IgnoreProperty, PropertyType } from '@tsed/common';
import { Model } from '@tsed/mongoose';
import { Ability, Weapon } from './rune';

@Model()
export class RunesHolder {
  @IgnoreProperty() public _id = '';

  public constructor(
    @PropertyType(Ability) public abilities: Ability[] = [],
    @PropertyType(Weapon) public weapons: Weapon[] = [],
  ) { }
}
