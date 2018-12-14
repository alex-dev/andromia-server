import { Controller, Inject, Get, Authenticated, PathParams, MergeParams } from '@tsed/common';
import { MongooseModel } from '@tsed/mongoose';
import { OwnedUnit } from '../models/ownedunit';

@Controller('/:explorateur/units')
@MergeParams()
@Authenticated()
export class UnitsExplorateursController {
  public constructor(@Inject(OwnedUnit) private units: MongooseModel<OwnedUnit>) { }

  @Get('')
  async get() {
    // TODO: Alexandre
  }

  @Get('/:uuid')
  async getOne(
    @PathParams('explorateur', String) explorateur: string,
    @PathParams('uuid', String) uuid: string) {
    return await this.units.findOne({ uuid: uuid })
      .populate({ path: 'explorateur', match: { name: explorateur }});
  }
}
