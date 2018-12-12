import { Service } from '@tsed/common';
import { LinkerInterface } from './linker.interface';
import { Unit } from '../models/unit';

@Service()
export class UnitLinker implements LinkerInterface<Unit> {
  private readonly url = {
    current: `${ process.env.SERVER_URL }/units`,
    server: process.env.SERVER_URL
  };

  public link(unit: Unit): { href: string } {
    return {
      href: `${ this.url.current }/${ unit.name }`
    }
  }
}
