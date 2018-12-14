import { IConverter, Converter, IDeserializer, ISerializer, PropertyMetadata, PropertyRegistry } from '@tsed/common';
import { OwnedUnit } from '../models/ownedunit';
import { Unit } from '../models/unit';
import { BaseConverter } from './baseconverter';

@Converter(OwnedUnit)
export class OwnedUnitConverter extends BaseConverter implements IConverter {
  public deserialize(data: any, target: any, base: any, deserializer: IDeserializer): OwnedUnit|undefined {
    const getUnit = () => {
      const subdata = Object.assign({}, data);
      delete subdata['uuid'];
      delete subdata['kernel'];  
      return subdata;
    }

    if (target !== OwnedUnit) {
      return;
    }

    const value = new OwnedUnit(
      deserializer(data['uuid'], String),
      deserializer(getUnit(), Unit),
      deserializer(data['kernel'], Map, Number)
    );

    this.checkRequiredValue(value, PropertyRegistry.getProperties(OwnedUnit));
    return value;
  }

  public serialize(object: OwnedUnit, serializer: ISerializer): any {
    const properties = PropertyRegistry.getProperties(OwnedUnit);
    this.checkRequiredValue(object, properties);
    
    const value: any = serializer(object.unit);
    delete value.href;

    for (const key of [...properties.keys()].filter(key => key !== 'unit')) {
      const metadata = BaseConverter.getPropertyMetadata(properties, key);
      value[(metadata && metadata.name) || key] = serializer((object as any)[key]);
    }

    return value;
  }
}