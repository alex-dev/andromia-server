import { Controller, Inject, Get, Authenticated, PathParams, MergeParams, Post, BodyParams, Status, Response, UseAfter, UseBefore, QueryParams } from '@tsed/common';
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
import { PagingParamsMiddleware } from '../middlewares/paging.middleware';

@Controller('/:explorateur/explorations')
@MergeParams()
export class ExplorationsExplorateursController {
  public constructor(
    @Inject(Exploration) private explorations: MongooseModel<Exploration>,
    @Inject(Explorateur) private explorateurs: MongooseModel<Explorateur>,
    @Inject(UnitResult) private unitResults: MongooseModel<UnitResult>,
    @Inject(OwnedUnit) private ownedUnits: MongooseModel<OwnedUnit>,
    @Inject(Unit) private units: MongooseModel<Unit>,
    @Inject(RunesHolder) private runes: MongooseModel<RunesHolder>) { }

  @Get('')
  @Authenticated()
  @UseBefore(PagingParamsMiddleware)
  async get(  
    @PathParams('explorateur', String) name: string,
    @QueryParams('page', Number) page: number,
    @QueryParams('size', Number) size: number,
    @Response() response: ExpressResponse): Promise<Exploration[]|null> {
    const explorateur = await this.explorateurs.findOne({ name: name });

    if (!explorateur) {
      return explorateur;
    }

    response.locals.count = await this.explorations.countDocuments({ explorateur: explorateur._id });
    return await this.explorations.find({ explorateur: explorateur._id }).skip(page * size).limit(size);
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
    return await this.explorateurs.findByIdAndUpdate(explorateur._id, {
      location: explorateur.location,
      inox: explorateur.inox,
      runes: explorateur.runes
    }, { new: true }) as Explorateur;
  }

  @Get('/:id')
  @Authenticated()
  async getOne(
    @PathParams('explorateur', String) name: string,
    @PathParams('id', String) id: string): Promise<Exploration|null> {
    const exploration = await this.explorations.findOne({ _id: id });

    // Si exploration est undefined, la logique du sendresponse va s'occuper du 404.
    if (exploration && (exploration.explorateur as Explorateur).name != name) {
      return null;
    }

    return exploration;    
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
