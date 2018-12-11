import { Service } from '@tsed/common';
import { LinkerInterface } from './linker.interface';
import { Explorateur } from '../models/explorateur';
import { OwnedUnit } from '../models/ownedunit';

@Service()
export class OwnedUnitLinker implements LinkerInterface<OwnedUnit> {
  private readonly _url = {
    current: `${ process.env.SERVER_URL }/explorateurs`,
    server: process.env.SERVER_URL
  };

  private url(unit: OwnedUnit) {
    const explorateur = unit.explorateur instanceof Explorateur
      ? unit.explorateur._id
      : unit.explorateur as string;

    return {
      current: `${ this._url.current }/${ explorateur }/explorations`,
      server: this._url.server
    }
  }

  public link(unit: OwnedUnit): { href: string } {
    return {
      href: `${ this.url(unit).current }/${ unit._id }`
    }
  }
}
