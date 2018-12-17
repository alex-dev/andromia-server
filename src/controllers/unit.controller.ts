import { Controller, Inject, Get, PathParams, UseBefore, QueryParams, Response } from '@tsed/common';
import { MongooseModel } from '@tsed/mongoose';
import { Unit } from '../models/unit';
import { PagingParamsMiddleware } from '../middlewares/paging.middleware';
import { Response as ExpressResponse } from 'express';

@Controller('/units')
export class UnitsController {
  public constructor(@Inject(Unit) private units: MongooseModel<Unit>) { }

  @Get('')
  @UseBefore(PagingParamsMiddleware)
  async get(
    @QueryParams('page', Number) page: number,
    @QueryParams('size', Number) size: number,
    @Response() response: ExpressResponse): Promise<Unit[]|null> {
    response.locals.count = await this.units.countDocuments();
    return await this.units.find().skip(page * size).limit(size);
  }

  @Get('/:name')
  async getOne(@PathParams('name', String) name: string): Promise<Unit|null> {
    return await this.units.findOne({ name: name });
  }
}
