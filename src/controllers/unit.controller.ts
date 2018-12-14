import { Controller, Inject, Get, PathParams } from '@tsed/common';
import { MongooseModel } from '@tsed/mongoose';
import { Unit } from '../models/unit';

@Controller('/units')
export class UnitsController {
  public constructor(@Inject(Unit) private units: MongooseModel<Unit>) { }

  @Get('')
  async get() {
    // TODO: Guillaume
  }

  @Get('/:name')
  async getOne(@PathParams('name', String) name: string) {
    return await this.units.findOne({ name: name });
  }
}
