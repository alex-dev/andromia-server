import { IConverter, Converter, IDeserializer, ISerializer, PropertyMetadata, PropertyRegistry } from '@tsed/common';
import { Unit } from '../models/unit';
import { getClass } from '@tsed/core';
import { RequiredPropertyError } from '../errors';
import { BaseConverter } from './base.converter';

@Converter(Unit)
export class OwnedUnitConverter extends BaseConverter implements IConverter {
  public deserialize(data: any, target: any, base: any, deserializer: IDeserializer): Unit|undefined {
    if (target !== Unit) {
      return;
    }

    // @ts-ignore
    const instance = new Unit();
    const properties = PropertyRegistry.getProperties(Unit);

    if (data['runes']) {
      instance.abilities = deserializer(data['runes']['abilities'], Array, String);
      instance.weapons = deserializer(data['runes']['weapons'], Array, String);
    }

    for (const [key, value] of Object.entries(instance)
      .filter(([key, value]) => value !== 'function' && key !== 'runes')) {
      const metadata = BaseConverter.getPropertyMetadata(properties, key);
      this.deserializeProperty(data, instance, key, metadata, deserializer);
    }

    this.checkRequiredValue(instance, properties);
    return instance;
  }

  public serialize(object: Unit, serializer: ISerializer): any {
    this.checkRequiredValue(object, PropertyRegistry.getProperties(Unit));

    const data: any = {
      runes: {
        abilities: serializer(object.abilities),
        weapons: serializer(object.weapons)
      }
    };
    
    for (const [key, value] of Object.entries(object)
      .filter(([key, value]) => typeof value !== 'function' && key !== 'runes')) {
      data[key] = serializer(value);
    }

    return data;
  }
}
