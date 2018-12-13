import { IgnoreProperty, Required } from '@tsed/common';
import { Model, Unique, Ref, Schema } from '@tsed/mongoose';
import { Ability } from './types';
import { Unit } from './unit';
import { Explorateur } from './explorateur';

@Model({
  collection: 'ownedunits',
  schemaOptions: {
    strict: 'throw',
    useNestedStrict: true,
    versionKey: false,
    timestamps: false
  }
})
export class OwnedUnit {
  @IgnoreProperty() public _id = '';
  @IgnoreProperty() @Ref('Explorateur') public explorateur: Ref<Explorateur>|null = null;
  @Unique() @Required() public uuid: string;
  @Required() @Ref('Unit') @Schema({ autopopulate: true }) public unit: Ref<Unit>;
  @Required() public kernel: Map<Ability, number>;

  public constructor(uuid: string, unit: Unit, kernel: Map<Ability, number>) {
    this.uuid = uuid;
    this.unit = unit;
    this.kernel = kernel;
  }

  public capture(explorateur: Explorateur) {
    this.explorateur = explorateur;
  }
}