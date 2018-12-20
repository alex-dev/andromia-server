import { Property, PropertyType, IgnoreProperty, Required } from '@tsed/common';
import { Indexed, Model, Unique, Ref, Schema, PostHook, MongoosePlugin as Plugin } from '@tsed/mongoose';
import { Ability, Set } from './types';
import { Unit } from './unit';
import { Explorateur } from './explorateur';
import { RunesHolder } from './runesholder';
import { conflictMiddleware } from '../mongoose.middlewares/conflict.middleware';
// @ts-ignore
import * as autopopulate from 'mongoose-autopopulate';

@Model({
  collection: 'ownedunits',
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
export class OwnedUnit {
  @IgnoreProperty() public _id: string|undefined;
  @Property() @Ref('Explorateur') @Schema({ autopopulate: true }) public explorateur: Ref<Explorateur>|null = null;
  @Unique() @Required() public uuid: string;
  @Indexed() @Required() public set: Set;
  @Required() public created: Date;
  @Required() @Ref(Unit) @Schema({ autopopulate: true }) public unit: Ref<Unit>;
  @Required() @PropertyType(Number) @Schema({ type: Map, of: Number }) public kernel: Map<Ability, number>;
  @Required() @Ref(RunesHolder) @Schema({ autopopulate: true }) public runes: Ref<RunesHolder>;

  public constructor(uuid: string, set: Set, created: Date, unit: Unit, runes: RunesHolder, kernel: Map<Ability, number>) {
    this.uuid = uuid;
    this.set = set;
    this.created = created;
    this.unit = unit;
    this.runes = runes;
    this.kernel = kernel;
  }

  public capture(explorateur: Explorateur) {
    this.explorateur = explorateur;
  }
}