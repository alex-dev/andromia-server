import { Controller, Post, BodyParams, UseAfter, Inject, Status, Get, Authenticated, UseBefore, QueryParams, Response, PathParams } from '@tsed/common';
import { ConnectionMiddleware } from '../middlewares/connection.middleware';
import { MongooseModel } from '@tsed/mongoose';
import { Explorateur } from '../models/explorateur';
import { Response as ExpressResponse } from 'express';
import * as bcrypt from 'bcrypt';
import { ResultLocationMiddleware } from '../middlewares/location.middleware';
import { ExplorationsExplorateursController } from './explorations.explorateurs.controller';
import { UnitsExplorateursController } from './units.explorateurs.controller';
import { UnprocessableEntity } from 'ts-httpexceptions';
import { PagingParamsMiddleware } from '../middlewares/paging.middleware';
import { NotFound } from "ts-httpexceptions";

@Controller('/explorateurs', ExplorationsExplorateursController, UnitsExplorateursController)
export class ExplorateursController {
  public constructor(@Inject(Explorateur) private explorateurs: MongooseModel<Explorateur>) { }

  @Post('')
  @Status(201)
  @UseAfter(ResultLocationMiddleware, ConnectionMiddleware)
  async create(
    @BodyParams('email', String) email: string,
    @BodyParams('name', String) name: string,
    @BodyParams('password', String) password: string) {
    if (!/[a-zA-Z0-9.!\$&'*+/-?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z09-])+/.test(email)) {
      throw new UnprocessableEntity('Invalid email');
    }

    const explorateur = new Explorateur(email, name, await bcrypt.hash(password, 11));
    return await this.explorateurs.create(explorateur);
  }

  @Get('')
  @Authenticated()
  @UseBefore(PagingParamsMiddleware)
  async get(
    @QueryParams('page', Number) page: number,
    @QueryParams('size', Number) size: number,
    @Response() response: ExpressResponse) {
    response.locals.count = await this.explorateurs.countDocuments({});
    return await this.explorateurs.find();
  }

  @Get('/:explorateur')
  @Authenticated()
  async getOne(
    @PathParams('explorateur', String) name: string) {
      return await this.explorateurs.findOne({ name: name });
    }
}
