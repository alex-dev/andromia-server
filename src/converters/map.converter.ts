import { Converter, IDeserializer, ISerializer, PropertyRegistry } from '@tsed/common';
import { MapConverter as BaseConverter } from '@tsed/common/lib/converters/components/MapConverter'

@Converter(Map)
export class MapConverter extends BaseConverter {
  public deserialize<T>(data: any, target: any, base: any, deserializer: IDeserializer): Map<string, T> {
    for (const [key, value] of Object.entries(data).filter(([key, value]) => !value)) {
      delete data[key];
    } 
    
    return super.deserialize<T>(data, target, base, deserializer);
  }

  public serialize<T>(object: Map<string, T>, serializer: ISerializer): any {
    return super.serialize<T>(object, serializer);
  }
}