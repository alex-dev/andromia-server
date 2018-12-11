import { IgnoreProperty, Required, Minimum } from '@tsed/common';
import { Indexed, Model, Unique } from '@tsed/mongoose';
import { Ability, Set, Weapon } from './types';

@Model()
export class Unit {
  @IgnoreProperty() public _id = '';
  @Unique() @Required() public number: number;
  @Unique() @Required() public name: string;
  @Indexed() @Required() public set: Set;
  @Minimum(0) @Required() public life: number;
  @Minimum(0) @Required() public speed: number;
  @Required() public imageURL: string;
  @Indexed() @Required() public affinity: Ability;
  @Required() public abilities: Ability[];
  @Required() public weapons: Weapon[];

  public constructor(number: number, name: string, set: Set, life: number, speed: number, imageURL: string, affinity: Ability, abilities: Ability[], weapons: Weapon[]) {
    this.number = number;
    this.name = name;
    this.set = set;
    this.life = life;
    this.speed = speed;
    this.imageURL = imageURL;
    this.affinity = affinity;
    this.abilities = abilities;
    this.weapons = weapons;
  }
}