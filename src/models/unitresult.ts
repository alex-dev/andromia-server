import { Required, IgnoreProperty } from '@tsed/common';
import { Model, Unique, Ref, Schema, PostHook } from '@tsed/mongoose';
import { OwnedUnit } from './ownedunit';
import { conflictMiddleware } from '../mongoose.middlewares/conflict.middleware';

@Model({
  collection: 'unitresults',
  schemaOptions: {
    strict: 'throw',
    useNestedStrict: true,
    versionKey: false,
    timestamps: false
  }
})
@PostHook('save', conflictMiddleware)
@PostHook('update', conflictMiddleware)
@PostHook('findOneAndUpdate', conflictMiddleware)
@PostHook('insertMany', conflictMiddleware)
export class UnitResult {
  @IgnoreProperty() public _id: string|undefined;
  @Unique() @Required() @Ref('OwnedUnit') @Schema({ autopopulate: true }) public unit: Ref<OwnedUnit>;
  @Required() public accepted: boolean;

  public constructor(unit: OwnedUnit, accepted: boolean) {
    this.unit = unit;
    this.accepted = accepted;
  }
}
