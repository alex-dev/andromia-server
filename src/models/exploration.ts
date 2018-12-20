import { Property, PropertyType, Required, IgnoreProperty } from '@tsed/common';
import { Model, Ref, Schema, PostHook, MongoosePlugin as Plugin } from '@tsed/mongoose';
import { Explorateur } from './explorateur';
import { Ability, Location } from './types';
import { UnitResult } from './unitresult';
import { conflictMiddleware } from '../mongoose.middlewares/conflict.middleware';
// @ts-ignore
import * as autopopulate from 'mongoose-autopopulate';

@Model({
  collection: 'explorations',
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
export class Exploration {
  @Property('id') public _id: string|undefined;
  @Property() @Ref('Explorateur') @Schema({ required: true, autopopulate: true }) public explorateur: Ref<Explorateur>|null = null;
  @Required() public started: Date;
  @Required() public ended: Date;
  @Property() public from: Location | null = null;
  @Required() public to: Location;
  @Property() @Ref(UnitResult) @Schema({ autopopulate: true }) public unit: Ref<UnitResult>|null;
  @Property() @PropertyType(Number) @Schema({ type: Map, of: Number }) public runes: Map<Ability, number>;

  public constructor(started: Date, ended: Date, to: Location, unit: UnitResult|null = null, runes = new Map<Ability, number>()) {
    this.started = started;
    this.ended = ended;
    this.to = to;
    this.unit = unit;
    this.runes = runes;
  }

  public complete(explorateur: Explorateur, start: Location) {
    this.explorateur = explorateur;
    this.from = start;
  }
}
