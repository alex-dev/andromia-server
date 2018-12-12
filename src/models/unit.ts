import { IgnoreProperty, Required, Minimum } from '@tsed/common';
import { Indexed, Model, Unique, Ref } from '@tsed/mongoose';
import { Ability, Set } from './types';
import { RunesHolder } from './runesholder';

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
  @Required() @Ref('RunesHolder') public runes: RunesHolder;

  public constructor(number: number, name: string, set: Set, life: number, speed: number, imageURL: string, affinity: Ability, runes: RunesHolder) {
    this.number = number;
    this.name = name;
    this.set = set;
    this.life = life;
    this.speed = speed;
    this.imageURL = imageURL;
    this.affinity = affinity;
    this.runes = runes;
  }
}
