import { IgnoreProperty, Required } from '@tsed/common';
import { Model, Unique, Ref } from '@tsed/mongoose';
import { Ability } from './rune';
import { Unit } from './unit';

@Model()
export class OwnedUnit {
  @IgnoreProperty() public _id = '';

  public constructor(
    @Unique() @Required() public uuid: string,
    @Ref(Unit) @Required() public unit: Ref<Unit>,
    @Required() public kernel: Map<Ability, number>
  ) { }
}