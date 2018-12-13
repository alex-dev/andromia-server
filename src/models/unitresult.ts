import { Required, IgnoreProperty } from '@tsed/common';
import { Model, Unique, Ref, Schema } from '@tsed/mongoose';
import { OwnedUnit } from './ownedunit';

@Model({
  collection: 'unitresults',
  schemaOptions: {
    strict: 'throw',
    useNestedStrict: true,
    versionKey: false,
    timestamps: false
  }
})
export class UnitResult {
  @IgnoreProperty() public _id = '';
  @Unique() @Required() @Ref('OwnedUnit') @Schema({ autopopulate: true }) public unit: Ref<OwnedUnit>;
  @Required() public accepted: boolean;

  public constructor(unit: OwnedUnit, accepted: boolean) {
    this.unit = unit;
    this.accepted = accepted;
  }
}
