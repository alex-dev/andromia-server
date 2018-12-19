import { PropertyType, IgnoreProperty, Required, Minimum } from '@tsed/common';
import { Indexed, Model, Unique, Ref, Schema, PostHook, MongoosePlugin as Plugin } from '@tsed/mongoose';
import { Ability, Set } from './types';
import { RunesHolder } from './runesholder';
import { conflictMiddleware } from '../mongoose.middlewares/conflict.middleware';
// @ts-ignore
import * as autopopulate from 'mongoose-autopopulate';

@Model({
  collection: 'units',
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
export class Unit {
  @IgnoreProperty() public _id: string|undefined;
  @Unique() @Required() public number: number;
  @Unique() @Required() public name: string;
  @Indexed() @Required() public set: Set;
  @Minimum(0) @Required() public life: number;
  @Minimum(0) @Required() public speed: number;
  @Required() public imageURL: string;
  @Indexed() @Required() public affinity: Ability;
  @PropertyType(RunesHolder) @Required() @Ref('RunesHolder') @Schema({ autopopulate: true }) public runes: Ref<RunesHolder>;

  public constructor(number: number, name: string, set: Set, life: number, speed: number, imageURL: string, affinity: Ability, runes: RunesHolder) {
    this.number = number;
    this.name = name;
    this.set = set;
    this.life = life;
    this.speed = speed;
    this.imageURL = imageURL;
    this.affinity = affinity;
    this.runes = runes;
  }
}
