import { PropertyMetadata, IDeserializer, PropertyRegistry, IConverterOptions, ISerializer } from "@tsed/common";
import { getClass, Store, isPrimitiveOrPrimitiveClass } from "@tsed/core";
import { UnknownPropertyError, RequiredPropertyError, InvalidPropertyError } from "../errors";

export abstract class BaseConverter {
  protected validation = true;

  protected deserializeDefault(object: any, target:any, deserializer: IDeserializer, checkRequired: boolean) {
    const instance = new target();
    const properties = PropertyRegistry.getProperties(target);

    for (const key of Object.keys(object).filter(key => instance[key] !== 'function')) {
      const metadata = BaseConverter.getPropertyMetadata(properties, key);
      this.deserializeProperty(object, instance, key, metadata, deserializer);
    }

    if (checkRequired) {
      this.checkRequiredValue(instance, properties);
    }

    return instance;
  }

  protected serializeDefault(object: any, serializer: ISerializer, type: any, checkRequired = true) {
    return isPrimitiveOrPrimitiveClass(object) ? object : this.serializeObject(object, serializer, type, checkRequired);
  }

  protected serializeObject(object: any, serializer: ISerializer, type: any, checkRequired: boolean) {
    const properties = PropertyRegistry.getProperties(type || object);
    const value: any = {};

    if (checkRequired) {
      this.checkRequiredValue(object, properties);
    }

    for (const key of properties.size 
      ? [...properties.keys()] 
      : Object.keys(object).filter(key => typeof object[key] !== 'function')) {
      const metadata = BaseConverter.getPropertyMetadata(properties, key);
      value[(metadata && metadata.name) || key] = serializer(object[key]);
    }

    return value;
  }

  protected deserializeProperty(object: any, instance: any, property: string, metadata: PropertyMetadata|undefined, deserializer: IDeserializer) {
    this.checkUnknownValue(instance, property, metadata);

    const value = metadata && metadata.name ? object[metadata.name] : object[property];
    const key = (metadata && metadata.propertyKey) || property;
    const type = metadata && metadata.type;
    const collection = metadata && metadata.isCollection ? metadata.collectionType : type;

    try {
      instance[key] = deserializer(value, collection, type);
    } catch (err) {
      throw new InvalidPropertyError(getClass(instance), property, value);
    }
  }

  protected checkRequiredValue(instance: any, properties: Map<string|symbol, PropertyMetadata>) {
    for (const property of properties.values()) {
      if (property.isRequired(instance[property.propertyKey])) {
        throw new RequiredPropertyError(getClass(instance), property.propertyKey);
      }
    }
  }

  protected checkUnknownValue(instance: any, property: string|symbol, metadata?: PropertyMetadata) {
    const target = getClass(instance);
    const strict = Store.from(target).get('modelStrict');

    if (!metadata && target !== Object && (strict === undefined ? this.validation : strict)) {
      throw new UnknownPropertyError(target, property);
    }
  }

  protected static getPropertyMetadata(
    properties: Map<string|symbol, PropertyMetadata>,
    property: string|symbol
  ): PropertyMetadata|undefined {
    const check = (properties: Iterator<PropertyMetadata>): PropertyMetadata|undefined => {
      for (let result = properties.next(); !result.done; result = properties.next()) {
        if (result.value.name === property || result.value.propertyKey === property) {
          return result.value;
        }
      }

      return undefined;
    }

    return properties.get(property) || check(properties.values());
  }
}