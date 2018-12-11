import { IgnoreProperty, Property, Required } from '@tsed/common';
import { Model, Unique, Ref } from '@tsed/mongoose';
import { Ability } from './types';
import { Unit } from './unit';
import { Explorateur } from './explorateur';

@Model()
export class OwnedUnit {
  @IgnoreProperty() public _id = '';
  @Property() @Ref('Explorateur') public explorateur: Ref<Explorateur> = '';
  @Unique() @Required() public uuid: string;
  @Ref('Unit') @Required() public unit: Ref<Unit>;
  @Required() public kernel: Map<Ability, number>;

  public constructor(uuid: string, unit: Unit, kernel: Map<Ability, number>) {
    this.uuid = uuid;
    this.unit = unit;
    this.kernel = kernel;
  }
}