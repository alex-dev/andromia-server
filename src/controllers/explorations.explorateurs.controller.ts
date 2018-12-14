import { Controller, Inject, Get, Authenticated, PathParams, MergeParams, Post, BodyParams, Status, Response, UseAfter } from '@tsed/common';
import { MongooseModel } from '@tsed/mongoose';
import { Exploration } from '../models/exploration';
import { Explorateur } from '../models/explorateur';
import { User } from '../filters/user.filter';
import { UnitResult } from '../models/unitresult';
import { OwnedUnit } from '../models/ownedunit';
import { Unit } from '../models/unit';
import { RunesHolder } from '../models/runesholder';
import { LocalLocationMiddleware } from '../middlewares/location.middleware';
import { Response as ExpressResponse } from 'express';

@Controller('/:explorateur/explorations')
@MergeParams()
@Authenticated()
export class ExplorationsExplorateursController {
  public constructor(
    @Inject(Exploration) private explorations: MongooseModel<Exploration>,
    @Inject(Explorateur) private explorateurs: MongooseModel<Explorateur>,
    @Inject(UnitResult) private unitResults: MongooseModel<UnitResult>,
    @Inject(OwnedUnit) private ownedUnits: MongooseModel<OwnedUnit>,
    @Inject(Unit) private units: MongooseModel<Unit>,
    @Inject(RunesHolder) private runes: MongooseModel<RunesHolder>) { }

  @Get('')
  async get() {
    // TODO: Alexandre
  }

  @Post('')
  @Status(201)
  @Authenticated({ limitToOwner: true })
  @UseAfter(LocalLocationMiddleware)
  async create(
    @User() explorateur: Explorateur,
    @BodyParams('', Exploration) exploration: Exploration,
    @Response() response: ExpressResponse): Promise<Explorateur> {
    explorateur.explore(exploration);

    if (exploration.unit) {
      exploration.unit = await this.createUnitResult(exploration.unit as UnitResult);
    }

    response.locals.created = await this.explorations.create(exploration);
    return await this.explorateurs.findByIdAndUpdate(explorateur._id, explorateur) as Explorateur;
  }

  @Get('/:id')
  async getOne(
    @PathParams('explorateur', String) explorateur: string,
    @PathParams('id', String) id: string) {
    return await this.explorations.findOne({ _id: id })
      .populate({ path: 'explorateur', match: { name: explorateur }});
  }

  private async createUnitResult(result: UnitResult): Promise<UnitResult> {
    result.unit = await this.createOwnedUnit(result.unit as OwnedUnit);
    return await this.unitResults.create(result);
  }

  private async createOwnedUnit(unit: OwnedUnit): Promise<OwnedUnit> {
    unit.unit = await this.units.findOne({ name: (unit.unit as Unit).name })
      || await this.createUnit(unit.unit as Unit);
    return await this.ownedUnits.create(unit);
  }

  private async createUnit(unit: Unit): Promise<Unit> {
    unit.runes = await this.runes.create(unit.runes);
    return await this.units.create(unit);
  }
}
