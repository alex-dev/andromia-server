import { Controller, MergeParams, Authenticated, Inject, Get, PathParams } from "@tsed/common";
import { MongooseModel } from '@tsed/mongoose';
import { Explorateur } from '../models/explorateur';
import { Ability } from "../models/types";

@Controller('/:explorateur/runes')
@MergeParams()
export class RunesExplorateursController {
  public constructor(@Inject(Explorateur) private explorateurs: MongooseModel<Explorateur>) { }

  @Get('')
  @Authenticated()
  async get(  
    @PathParams('explorateur', String) name: string): Promise<Map<Ability, number>|null> {
    const explorateur = await this.explorateurs.findOne({ name: name });
    return explorateur && explorateur.runes;
  }
}
