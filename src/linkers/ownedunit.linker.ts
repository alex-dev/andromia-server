import { Service } from '@tsed/common';
import { LinkerInterface } from './linker.interface';
import { Explorateur } from '../models/explorateur';
import { OwnedUnit } from '../models/ownedunit';
import { Unit } from '../models/unit';

@Service()
export class OwnedUnitLinker implements LinkerInterface<OwnedUnit> {
  private readonly _url = {
    current: `${ process.env.SERVER_URL }/explorateurs`,
    server: process.env.SERVER_URL
  };

  private url(unit: OwnedUnit) {
    const explorateur = unit.explorateur instanceof Explorateur
      ? unit.explorateur.name
      : unit.explorateur as string;

    return {
      current: `${ this._url.current }/${ explorateur }/explorations`,
      explorateur: `${ this._url.current }/${ explorateur }`,
      server: this._url.server
    }
  }

  public link(unit: OwnedUnit): { unit: string, href?: string, explorateur?: string } {
    const url = this.url(unit);
    return Object.assign({
      unit: `${ url.server }/units/${ unit.unit instanceof Unit ? unit.unit.name : unit.unit as string }`
    }, unit.explorateur && {
      href: `${ url.current }/${ unit.uuid }`,
      explorateur: url.explorateur 
    });
  }
}
