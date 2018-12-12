import { IConverter, Converter, IDeserializer, ISerializer, PropertyMetadata, PropertyRegistry } from '@tsed/common';
import { OwnedUnit } from '../models/ownedunit';
import { Unit } from '../models/unit';
import { BaseConverter } from './baseconverter';

@Converter(OwnedUnit)
export class OwnedUnitConverter extends BaseConverter implements IConverter {
  public constructor() {
    super();
  }
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
    this.checkRequiredValue(object, PropertyRegistry.getProperties(OwnedUnit));

    const data: any = serializer(object.unit);
    
    for (const [key, value] of Object.entries(object)
      .filter(([key, value]) => typeof value !== 'function' && key !== 'unit')) {
      data[key] = serializer(value);
    }

    return data;
  }
}