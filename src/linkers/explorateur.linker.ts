import { AbstractLinker, BasicLinkInterface } from './linker.abstract';
import { Explorateur } from '../models/explorateur';

export class ExplorateurLinker extends AbstractLinker<Explorateur> {
  private readonly url = `${ process.env.SERVER_URL }/explorateurs`;

  public link(explorateur: Explorateur): ExplorateurLinkInterface {
    return {
      href: `${ this.url }/${ explorateur.name }`,
      explorations: `${ this.url }/${ explorateur.name }/explorations`,
      units: `${ this.url }/${ explorateur.name }/units`
    }
  }
}

export interface ExplorateurLinkInterface extends BasicLinkInterface {
  explorations: string;
  units: string;
}
