import { Controller, Post, BodyParams, UseAfter, Inject, Status, Get, Authenticated, UseBefore, QueryParams, Response, PathParams, Put } from '@tsed/common';
import { ConnectionMiddleware } from '../middlewares/connection.middleware';
import { MongooseModel } from '@tsed/mongoose';
import { Explorateur } from '../models/explorateur';
import { Response as ExpressResponse } from 'express';
import * as bcrypt from 'bcrypt';
import { ResultLocationMiddleware } from '../middlewares/location.middleware';
import { ExplorationsExplorateursController } from './explorations.explorateurs.controller';
import { UnitsExplorateursController } from './units.explorateurs.controller';
import { UnprocessableEntity, BadRequest } from 'ts-httpexceptions';
import { PagingParamsMiddleware } from '../middlewares/paging.middleware';
import { User } from '../filters/user.filter';

@Controller('/explorateurs', ExplorationsExplorateursController, UnitsExplorateursController)
export class ExplorateursController {
  public constructor(@Inject(Explorateur) private explorateurs: MongooseModel<Explorateur>) { }

  @Post('')
  @Status(201)
  @UseAfter(ResultLocationMiddleware, ConnectionMiddleware)
  async create(
    @BodyParams('email', String) email: string,
    @BodyParams('name', String) name: string,
    @BodyParams('password', String) password: string): Promise<Explorateur> {
    if (!name) {
      throw new UnprocessableEntity('Invalid name');
    }
    if (!/[a-zA-Z0-9.!\$&'*+/-?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z09-])+/.test(email)) {
      throw new UnprocessableEntity('Invalid email');
    }
    if (!password) {
      throw new UnprocessableEntity('Invalid password');
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
    @Response() response: ExpressResponse): Promise<Explorateur[]> {
    response.locals.count = await this.explorateurs.countDocuments({});
    return await this.explorateurs.find();
  }

  @Get('/:explorateur')
  @Authenticated()
  async getOne(
    @PathParams('explorateur', String) name: string): Promise<Explorateur|null> {
    return await this.explorateurs.findOne({ name: name });
  }

  @Put('/:explorateur')
  @Authenticated({ limitToOwner: true })
  async modify(
    @User() user: Explorateur,
    @BodyParams('', Explorateur) explorateur: Explorateur): Promise<Explorateur|null> {
    
    if(user.name !== explorateur.name) {
      throw new BadRequest(`Cannot modify ${ user.name } to ${ explorateur.name }.`);
    }

    return await this.explorateurs.findByIdAndUpdate(user._id, {
      email: explorateur.email,
      password: explorateur.password
    });
  }
}
