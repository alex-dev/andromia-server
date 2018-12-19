import { AbstractLinker } from './linker.abstract';
import { Explorateur } from '../models/explorateur';
import { OwnedUnit } from '../models/ownedunit';
import { Unit } from '../models/unit';

export class OwnedUnitLinker extends AbstractLinker<OwnedUnit> {
  private url(unit: OwnedUnit) {
    return this.provider.get<Explorateur>(unit.explorateur as Explorateur)
      .link(unit.explorateur as Explorateur).href;
  }

  public link(unit: OwnedUnit): UnitLinkInterface {
    const value = {
      unit: this.provider.get<Unit>(unit.unit as Unit).link(unit.unit as Unit).href
    } as UnitLinkInterface;

    if (unit.explorateur) {
      value.explorateur = this.url(unit);
      value.href = `${ value.explorateur }/units/${ unit.uuid }`;
    }

    return value;
  }
}

export interface UnitLinkInterface {
  href?: string;
  explorateur?: string;
  unit: string;
}