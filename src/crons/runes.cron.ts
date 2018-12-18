import { Explorateur } from "../models/explorateur";
import { MongooseModel } from "@tsed/mongoose";
import { CronInterface } from "./cron.interface";
import { RunesQueryService } from "../services/runes.query.service";

export class RunesCron implements CronInterface {
  public readonly name = 'RunesCron'

  public constructor(
    private runes: RunesQueryService,
    private explorateurs: MongooseModel<Explorateur>) { }

  public get expression() {
    return '0 * * * *';
  }

  public async run() {
    const values: any = {};

    for (const rune of this.runes.defaultAbilities) {
      values[`runes.${ rune }`] = Math.floor(Math.random() * 4) + 2;
    }

    await this.explorateurs.updateMany({}, { $inc: values });
  }
}