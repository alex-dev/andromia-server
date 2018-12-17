import { Controller, Inject, Get, PathParams, Authenticated } from '@tsed/common';
import { MongooseModel } from '@tsed/mongoose';
import { Unit } from '../models/unit';

@Controller('/units')
export class UnitsController {
  public constructor(@Inject(Unit) private units: MongooseModel<Unit>) { }

  @Get('')
  @Authenticated()
  async get() {
    // TODO: Guillaume
  }

  @Get('/:name')
  @Authenticated()
  async getOne(@PathParams('name', String) name: string): Promise<Unit|null> {
    return await this.units.findOne({ name: name });
  }
}
