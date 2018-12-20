import { IConverter, Converter, IDeserializer, ISerializer, PropertyRegistry } from '@tsed/common';
import { nameOf } from '@tsed/core';
import { OwnedUnit } from '../models/ownedunit';
import { Unit } from '../models/unit';
import { RunesHolder } from '../models/runesholder';
import { BaseConverter } from './baseconverter';

@Converter(OwnedUnit)
export class OwnedUnitConverter extends BaseConverter implements IConverter {
  public deserialize(data: any, target: any, base: any, deserializer: IDeserializer): OwnedUnit|undefined {
    const getUnit = () => {
      const subdata = Object.assign({}, data);
      delete subdata['uuid'];
      delete subdata['set'];
      delete subdata['created'];
      delete subdata['runes'];
      delete subdata['kernel'];
      return subdata;
    }

    if (target !== OwnedUnit) {
      return;
    }
    
    const value = new OwnedUnit(
      deserializer(data['uuid'], String),
      deserializer(data['set'], String),
      deserializer(data['created'], Date),
      deserializer(getUnit(), Unit),
      deserializer(data['runes'], RunesHolder),
      deserializer(data['kernel'], Map, Number)
    );

    this.checkRequiredValue(value, PropertyRegistry.getProperties(OwnedUnit));
    return value;
  }

  public serialize(object: OwnedUnit, serializer: ISerializer): any {
    const properties = PropertyRegistry.getProperties(OwnedUnit);
    this.checkRequiredValue(object, properties);
    
    const value: any = serializer(object.unit);

    for (const key of [...properties.keys()].filter(key => !['unit', 'explorateur'].includes(nameOf(key)))) {
      const metadata = BaseConverter.getPropertyMetadata(properties, key);
      value[(metadata && metadata.name) || key] = serializer((object as any)[key]);
    }

    return value;
  }
}
