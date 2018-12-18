import { Service, AfterRoutesInit, Inject } from '@tsed/common';
import * as cron from 'node-cron';
import { Metadata } from '@tsed/core';
import { $log } from 'ts-log-debug';
import { InoxCron } from '../crons/inox.cron';
import { RunesCron } from '../crons/runes.cron';
import { CronInterface } from '../crons/cron.interface';
import { Explorateur } from '../models/explorateur';
import { MongooseModel } from '@tsed/mongoose';
import { RunesQueryService } from './runes.query.service';

@Service()
export class CronService implements AfterRoutesInit {
  private readonly crons: CronInterface[];

  public constructor(
    @Inject(Explorateur) explorateurs: MongooseModel<Explorateur>,
    runes: RunesQueryService) {
    this.crons = [
      new InoxCron(explorateurs),
      new RunesCron(runes, explorateurs)
    ];
  }

  public $afterRoutesInit() {
    for (const job of this.crons) {
      cron.schedule(job.expression, this.run(job));
    }

    $log.info('Crons scheduled');
  }

  private run(cron: CronInterface): () => Promise<void> {
    return async () => {
      $log.info(`${ cron.name } started.`)
      await cron.run();
      $log.info(`${ cron.name } ended.`)
    }
  }
}