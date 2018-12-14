import { AbstractLinker, BasicLinkInterface } from './linker.abstract';
import { Explorateur } from '../models/explorateur';
import { Exploration } from '../models/exploration';
import { UnitLinkInterface } from './ownedunit.linker';
import { OwnedUnit } from '../models/ownedunit';
import { UnitResult } from '../models/unitresult';

export class ExplorationLinker extends AbstractLinker<Exploration> {
  private url(exploration: Exploration) {
    return this.provider.get<Explorateur>(exploration.explorateur as Explorateur)
      .link(exploration.explorateur as Explorateur).href;
  }

  public link(exploration: Exploration): ExplorationLinkInterface {
    const url = this.url(exploration);
    const value = {
      href: `${ url }/explorations/${ exploration._id }`,
      explorateur: url,
    } as ExplorationLinkInterface;

    if (exploration.unit) {
      value.unit = {
        unit: this.provider.get<OwnedUnit>((exploration.unit as UnitResult).unit as OwnedUnit)
          .link((exploration.unit as UnitResult).unit as OwnedUnit)
      };
    }

    return value;
  }
}

export interface ExplorationLinkInterface extends BasicLinkInterface {
  explorateur: string
  unit?: {
    unit: UnitLinkInterface
  }
}
