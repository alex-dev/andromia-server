import { AbstractLinker } from './linker.abstract';

export class ArrayLinker extends AbstractLinker<Array<any>> {
  public link(collection: any[]): any[] {
    const linker = collection[0] && this.provider.get<any>(collection[0]);
    
    return collection.map(value => linker ? linker.link(value) : {});
  }
}

