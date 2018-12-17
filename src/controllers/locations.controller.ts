import { Controller, Inject, Get } from "@tsed/common";
import { MongooseModel } from '@tsed/mongoose';
import { Location } from "../models/types";
import { Explorateur } from "../models/explorateur";
import { Exploration } from "../models/exploration";

@Controller('/locations')
export class LocationsController {
  public constructor(@Inject(Explorateur) private explorateurs: MongooseModel<Explorateur>, 
  @Inject(Exploration) private explorations: MongooseModel<Exploration>) { }

  @Get('')
  async get(): Promise<Set<Location>> {
    const arrays = await Promise.all([
      this.explorateurs.distinct('location').exec() as Promise<Location[]>,
      this.explorations.distinct('to').exec() as Promise<Location[]>,
      this.explorations.distinct('from').exec() as Promise<Location[]>
    ]);

    return new Set<Location>(([] as Location[]).concat(...arrays));
  }
}