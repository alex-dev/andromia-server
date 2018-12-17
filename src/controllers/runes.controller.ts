import { Controller, Get } from "@tsed/common";
import { RunesQueryService } from "../services/runes.query.service";
import { Rune, Ability, Weapon } from "../models/types";

@Controller('/runes')
export class RunesController {
  public constructor(private runes: RunesQueryService) { }

  @Get('')
  public async get(): Promise<Set<Rune>> {
    return this.runes.runes();
  }

  @Get('/abilities')
  public async getAbilities(): Promise<Set<Ability>> {
    return this.runes.abilities();
  }

  @Get('/weapons')
  public async getWeapons(): Promise<Set<Weapon>> {
    return this.runes.weapons();
  }
}