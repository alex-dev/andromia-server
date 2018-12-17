import { Controller, Post, PathParams, BodyParams, UseAfter, Inject } from '@tsed/common';
import { ConnectionMiddleware } from '../middlewares/connection.middleware';
import { MongooseModel } from '@tsed/mongoose';
import { Explorateur } from '../models/explorateur';
import { Unauthorized } from '../errors';
import * as bcrypt from 'bcrypt';

@Controller('/login')
export class LoginController {
  public constructor(@Inject(Explorateur) private explorateurs: MongooseModel<Explorateur>) { }

  @Post('')
  @UseAfter(ConnectionMiddleware)
  async login(
    @BodyParams('name', String) name: string,
    @BodyParams('password', String) password: string) {
    const explorateur = await this.explorateurs.findOne({ $or: [{ email: name.toLowerCase() }, { name: name }] });
    
    if (!explorateur || !(await bcrypt.compare(password, explorateur.password))) {
      throw new Unauthorized('Invalid credentials');
    }

    return explorateur;
  }
}
