import { Property, Required } from '@tsed/common';
import { Model, Unique, Ref } from '@tsed/mongoose';
import { Location } from './location';
import { OwnedUnit } from './ownedunit';
import { Ability } from './rune';

class UnitResult {
  public constructor(
    @Ref(OwnedUnit) @Unique() @Required() public unit: Ref<OwnedUnit>,
    @Required() public accepted: boolean
  ) { }
}

@Model()
export class Exploration {
  @Property({ name: 'id' }) public _id = '';
  
  public constructor(
    @Required() public started: Date,
    @Required() public ended: Date,
    @Required() public from: Location,
    @Property() public to: Location | null = null,
    @Property() public unit: UnitResult | null = null,
    @Property() public runes: Map<Ability, number> = new Map<Ability, number>()
  ) { }
}
