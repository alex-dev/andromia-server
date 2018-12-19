import { PropertyType, Required, IgnoreProperty } from '@tsed/common';
import { Model, Unique, Ref, Schema, PostHook, MongoosePlugin as Plugin } from '@tsed/mongoose';
import { OwnedUnit } from './ownedunit';
import { conflictMiddleware } from '../mongoose.middlewares/conflict.middleware';
// @ts-ignore
import * as autopopulate from 'mongoose-autopopulate';

@Model({
  collection: 'unitresults',
  schemaOptions: {
    // @ts-ignore
    autoCreate: true,
    autoIndex: true,    
    strict: 'throw',
    useNestedStrict: true,
    versionKey: false,
    timestamps: false
  }
})
// @ts-ignore
@Plugin(autopopulate)
@PostHook('save', conflictMiddleware)
@PostHook('update', conflictMiddleware)
@PostHook('findOneAndUpdate', conflictMiddleware)
@PostHook('insertMany', conflictMiddleware)
export class UnitResult {
  @IgnoreProperty() public _id: string|undefined;
  @Unique() @PropertyType(OwnedUnit) @Required() @Ref('OwnedUnit') @Schema({ autopopulate: true }) public unit: Ref<OwnedUnit>;
  @Required() public accepted: boolean;

  public constructor(unit: OwnedUnit, accepted: boolean) {
    this.unit = unit;
    this.accepted = accepted;
  }
}
