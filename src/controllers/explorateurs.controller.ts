import { Controller, Post, PathParams, BodyParams, UseAfter, Inject, Status, Get, ValidationService, Authenticated } from '@tsed/common';
import { ConnectionMiddleware } from '../middlewares/connection.middleware';
import { MongooseModel } from '@tsed/mongoose';
import { Explorateur } from '../models/explorateur';
import * as bcrypt from 'bcrypt';
import { ResultLocationMiddleware } from '../middlewares/location.middleware';
import { ExplorationsExplorateursController } from './explorations.explorateurs.controller';
import { UnitsExplorateursController } from './units.explorateurs.controller';
import { UnprocessableEntity } from 'ts-httpexceptions';

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
  async get() {
    // TODO: Alexandre HALSON
    return await this.explorateurs.find();
  }
}
