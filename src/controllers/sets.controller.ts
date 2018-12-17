import { Controller, Inject, Get } from "@tsed/common";
import { MongooseModel } from '@tsed/mongoose';
import { Unit } from "../models/unit";
import { Set as SetModel } from "../models/types";

@Controller('/sets')
export class SetsController {
  public constructor(@Inject(Unit) private units: MongooseModel<Unit>) { }

  @Get('')
  async get(): Promise<Set<SetModel>> {
    return new Set<SetModel>(await this.units.distinct('set'));
  }
}