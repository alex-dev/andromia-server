import { Service } from '@tsed/common';
import { LinkerInterface } from './linker.interface';
import { Explorateur } from '../models/explorateur';

@Service()
export class ExplorateurLinker implements LinkerInterface<Explorateur> {
  private readonly url = {
    current: `${ process.env.SERVER_URL }/explorateurs`,
    server: process.env.SERVER_URL
  };

  public link(explorateur: Explorateur): { href: string, explorations: string, units: string} {
    return {
      href: `${ this.url.current }/${ explorateur.name }`,
      explorations: `${ this.url.current }/${ explorateur.name }/explorations`,
      units: `${ this.url.current }/${ explorateur.name }/units`
    }
  }
}
