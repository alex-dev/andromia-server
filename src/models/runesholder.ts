import { Required } from '@tsed/common';
import { Model, } from '@tsed/mongoose';
import { Ability, Weapon } from './types';

@Model()
export class RunesHolder {
  @Required() public abilities: Ability[];
  @Required() public weapons: Weapon[];

  public constructor(abilities: Ability[] = [], weapons: Weapon[] = []) {
    this.abilities = abilities;
    this.weapons = weapons;
  }
}
