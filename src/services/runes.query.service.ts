import { Service, Inject } from "@tsed/common";
import { Explorateur } from "../models/explorateur";
import { MongooseModel } from "@tsed/mongoose";
import { OwnedUnit } from "../models/ownedunit";
import { RunesHolder } from "../models/runesholder";
import { Exploration } from "../models/exploration";
import { Unit } from "../models/unit";
import { Ability, Weapon, Rune } from "../models/types";
import { ModelMapReduceOption } from "mongoose";

@Service()
export class RunesQueryService {
  public constructor(
    @Inject(Explorateur) private explorateurs: MongooseModel<Explorateur>,
    @Inject(Exploration) private explorations: MongooseModel<Exploration>,
    @Inject(OwnedUnit) private ownedunits: MongooseModel<OwnedUnit>,
    @Inject(Unit) private units: MongooseModel<Unit>,
    @Inject(RunesHolder) private runes_: MongooseModel<RunesHolder>) { }

  public async runes(): Promise<Set<Rune>> {
    const runes: [Set<Rune>, Set<Rune>] = await Promise.all([
      this.abilities(),
      this.weapons()
    ]);

    return new Set([...runes[0], ...runes[1]]);
  }

  public async abilities(): Promise<Set<Ability>> {
    const arrays = await Promise.all([
      this.runes_.distinct('abilities').exec() as Promise<Ability[]>,
      this.units.distinct('affinity').exec() as Promise<Ability[]>,
      this.reduceMap<Ability>(this.ownedunits
        .mapReduce(this.constructRunesMapReduce<OwnedUnit, Ability>('kernel'))),
      this.reduceMap<Ability>(this.explorations
        .mapReduce(this.constructRunesMapReduce<Exploration, Ability>('runes'))),
      this.reduceMap<Ability>(this.explorateurs
        .mapReduce(this.constructRunesMapReduce<Explorateur, Ability>('runes')))
    ]);

    return new Set<Ability>(([] as Ability[]).concat(...arrays));
  }

  public async weapons(): Promise<Set<Weapon>> {
    const runes: Weapon[] = await this.runes_.distinct('weapons');

    return new Set<Weapon>(runes);
  }

  public async reduceMap<T>(query: Promise<{ _id: T, value: null}[]>): Promise<T[]> {
    return (await query).map((object: any) => object._id);
  }

  public constructRunesMapReduce<Model, Key>(property: string): ModelMapReduceOption<Model, Key, null> {
    return {
      map: `function() { for (const rune in this.${ property }) { emit(rune, null); } }`,
      reduce: function(key, models) { return null; }
    }
  }
}