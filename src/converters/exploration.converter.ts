import { IConverter, Converter, IDeserializer, ISerializer } from '@tsed/common';
import { Exploration } from '../models/exploration';
import { BaseConverter } from './baseconverter';

@Converter(Exploration)
export class ExplorationConverter extends BaseConverter implements IConverter {
  public deserialize(data: any, target: any, base: any, deserializer: IDeserializer): Exploration|undefined {
    return this.deserializeDefault(data, target, deserializer, true);
  }

  public serialize(object: Exploration, serializer: ISerializer): any {
    const value = this.serializeDefault(object, serializer, Exploration, true);
    delete value.explorateur;
    return value;
  }
}