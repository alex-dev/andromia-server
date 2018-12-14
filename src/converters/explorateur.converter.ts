import { IConverter, Converter, IDeserializer, ISerializer } from '@tsed/common';
import { Explorateur } from '../models/explorateur';
import { BaseConverter } from './baseconverter';

@Converter(Explorateur)
export class ExplorateurConverter extends BaseConverter implements IConverter {
  public deserialize(data: any, target: any, base: any, deserializer: IDeserializer): Explorateur|undefined {
    return this.deserializeDefault(data, target, deserializer, true);
  }

  public serialize(object: Explorateur, serializer: ISerializer): any {
    const value = this.serializeDefault(object, serializer, true);
    delete value.password;
    return value;
  }
}