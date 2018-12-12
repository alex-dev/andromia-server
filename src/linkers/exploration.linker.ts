import { Service } from '@tsed/common';
import { LinkerInterface } from './linker.interface';
import { Explorateur } from '../models/explorateur';
import { Exploration } from '../models/exploration';

@Service()
export class ExplorationLinker implements LinkerInterface<Exploration> {
  private readonly _url = {
    current: `${ process.env.SERVER_URL }/explorateurs`,
    server: process.env.SERVER_URL
  };

  private url(exploration: Exploration) {
    const explorateur = exploration.explorateur instanceof Explorateur
      ? exploration.explorateur.name
      : exploration.explorateur as string;

    return {
      current: `${ this._url.current }/${ explorateur }/explorations`,
      server: this._url.server
    }
  }

  public link(exploration: Exploration): { href: string } {
    return {
      href: `${ this.url(exploration).current }/${ exploration._id }`
    }
  }
}
