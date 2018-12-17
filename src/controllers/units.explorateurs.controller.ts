import { Controller, Inject, Get, Authenticated, PathParams, MergeParams, UseBefore, Response, QueryParams } from '@tsed/common';
import { MongooseModel } from '@tsed/mongoose';
import { Response as ExpressResponse } from 'express';
import { OwnedUnit } from '../models/ownedunit';
import { PagingParamsMiddleware } from '../middlewares/paging.middleware';
import { Explorateur } from '../models/explorateur';
import { NotFound } from 'ts-httpexceptions';

@Controller('/:explorateur/units')
@MergeParams()
export class UnitsExplorateursController {
  public constructor(
    @Inject(Explorateur) private explorateurs: MongooseModel<Explorateur>,
    @Inject(OwnedUnit) private units: MongooseModel<OwnedUnit>) { }

  @Get('')
  @Authenticated()
  @UseBefore(PagingParamsMiddleware)
  async get(
    @PathParams('explorateur', String) name: string,
    @QueryParams('page', Number) page: number,
    @QueryParams('size', Number) size: number,
    @Response() response: ExpressResponse) {
    const explorateur = await this.explorateurs.findOne({ name: name });

    if (!explorateur) {
      return explorateur;
    }

    response.locals.count = await this.units.countDocuments({ explorateur: explorateur._id });
    return await this.units.find({ explorateur: explorateur._id }).skip(page * size).limit(size);
  }

  @Get('/:uuid')
  @Authenticated()
  async getOne(
    @PathParams('explorateur', String) name: string,
    @PathParams('uuid', String) uuid: string) {
    const unit = await this.units.findOne({ uuid: uuid });

    // Si unit est undefined, la logique du sendresponse va s'occuper du 404.
    if (unit && (unit.explorateur as Explorateur).name != name) {
      return undefined;
    }

    return unit;
  }
}
