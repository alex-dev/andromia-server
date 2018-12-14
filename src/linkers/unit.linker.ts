import { AbstractLinker, BasicLinkInterface } from './linker.abstract';
import { Unit } from '../models/unit';

export class UnitLinker extends AbstractLinker<Unit> {
  private readonly url = `${ process.env.SERVER_URL }/units`

  public link(unit: Unit): BasicLinkInterface {
    return {
      href: `${ this.url }/${ unit.name }`
    }
  }
}
