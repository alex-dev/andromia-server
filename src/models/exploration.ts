import { Property, Required } from '@tsed/common';
import { Model, Unique, Ref } from '@tsed/mongoose';
import { Explorateur } from './explorateur';
import { Ability, Location } from './types';
import { OwnedUnit } from './ownedunit';

class UnitResult {
  @Ref(OwnedUnit) @Unique() @Required() public unit: Ref<OwnedUnit>;
  @Required() public accepted: boolean;

  public constructor(unit: OwnedUnit, accepted: boolean) {
    this.unit = unit;
    this.accepted = accepted;
  }
}

@Model()
export class Exploration {
  @Property('id') public _id = '';
  @Property('explorateur') @Ref('Explorateur') public explorateur: Ref<Explorateur> = '';
  @Required() public started: Date;  @Required() public ended: Date;
  @Property() public from: Location | null = null;
  @Required() public to: Location;
  @Property() public unit: UnitResult | null;
  @Property() public runes: Map<Ability, number>;

  public constructor(started: Date, ended: Date, to: Location, unit?: UnitResult, runes = new Map<Ability, number>()) {
    this.started = started;
    this.ended = ended;
    this.to = to;
    this.unit = unit || null;
    this.runes = runes;
  }

  public complete(explorateur: Explorateur, start: Location) {
    this.explorateur = explorateur;
    this.from = start;
  }
}
