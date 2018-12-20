import { Controller, Inject, Get } from "@tsed/common";
import { MongooseModel } from '@tsed/mongoose';
import { OwnedUnit } from "../models/ownedunit";
import { Set as SetModel } from "../models/types";

@Controller('/sets')
export class SetsController {
  public constructor(@Inject(OwnedUnit) private units: MongooseModel<OwnedUnit>) { }

  @Get('')
  async get(): Promise<Set<SetModel>> {
    return new Set<SetModel>(await this.units.distinct('set'));
  }
}