import { IgnoreProperty, Property, Required } from '@tsed/common';
import { Indexed, Model, Unique } from '@tsed/mongoose';
import { Ability } from './rune';
import { RunesHolder } from './runesholder';
import { Set } from './set';

@Model()
export class Unit {
  @IgnoreProperty() public _id = '';

  public constructor(
    @Unique() @Required() public number: string,
    @Unique() @Required() public name: string,
    @Indexed() @Required() public set: Set,
    @Required() public life: number,
    @Required() public speed: number,
    @Required() public imageURL: string,
    @Indexed() @Required() public affinity: Ability,
    @Property() public runes: RunesHolder = new RunesHolder
  ) { }
}