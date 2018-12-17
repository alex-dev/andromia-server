import { Service, Inject } from "@tsed/common";
import { Explorateur } from "../models/explorateur";
import { MongooseModel } from "@tsed/mongoose";
import { CronInterface } from "./cron.interface";
import { $log } from "ts-log-debug";

@Service()
export class InoxCron implements CronInterface {
  public readonly name = 'InoxCron';

  public constructor(@Inject(Explorateur) private explorateurs: MongooseModel<Explorateur>) { }

  public get expression() {
    return '*/5 * * * *';
  }

  public async run() {
    await this.explorateurs.updateMany({}, { $inc: { inox: 2 } });
  }
}