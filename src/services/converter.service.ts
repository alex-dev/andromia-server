import { getClass, isEmpty, Metadata, Store, isArrayOrArrayClass } from '@tsed/core';
import { ConverterService as Converter, IConverterOptions, InjectorService, OverrideService, ServerSettingsService, IConverter, IDeserializer, ISerializer } from '@tsed/common';
import { ConverterSerializationError } from '@tsed/common/lib/converters/errors/ConverterSerializationError';
import { ConverterDeserializationError } from '@tsed/common/lib/converters/errors/ConverterDeserializationError';
import { CONVERTER } from '@tsed/common/lib/converters/constants/index';
import { BadRequest, InternalServerError } from 'ts-httpexceptions';
import { LinkerProvider } from './linker.provider';
import { BaseConverter } from '../converters/base.converter';

@OverrideService(Converter)
export class ConverterService extends BaseConverter {
  public constructor(private injector: InjectorService, settings: ServerSettingsService) {
    super();
    this.validation = settings.get<boolean>('validationModelStrict');
  }

  public serialize(object: any, options: IConverterOptions = {}): any {
    const { type, checkRequiredValue = true} = options;

    const serializer = () => {
      const serializer: ISerializer = object => this.serialize(object, options);

      try {
        if (isEmpty(object)) {
          return object;
        }

        return this.serializeConverter(object, serializer)
          || this.serializeSerializable(object, options)
          || this.serializeDefault(object, serializer, type, checkRequiredValue);
      } catch (err) {
        if (!(err instanceof BadRequest) && !(err instanceof InternalServerError)) {
          err = new ConverterSerializationError(getClass(object), err);
        }

        throw err;
      }
    }

    const linker = () => {
      const linker = this.injector.get<LinkerProvider>(LinkerProvider)!.get<any>(getClass(object));
      return linker && linker.link(object);
    }

    // Handle merging. If serialized data is string, can be replaced by linker.
    const merge = (data: any, link: any) => {
      for (const [key, value] of Object.entries(link)
        .filter(([key, value]) => !data[key] || data[key] instanceof String)) {
        data[key] = value;
      }

      return data;
    }

    return merge(serializer(), linker() || {});
  }

  public deserialize(object: any, target: any, base?: any, options: IConverterOptions = {}): any {
    const deserializer: IDeserializer = (object, target, base) => this.deserialize(object, target, base, options);
    const { ignoreCallback, checkRequiredValue = true } = options;

    try {
      if ((ignoreCallback && ignoreCallback(object, target, base))
        || (target !== Boolean && (isEmpty(object) || isEmpty(target) || target === Object))) {
        return object;
      }

      return this.deserializeConverter(object, target, base, deserializer)
        || this.deserializeIterable(object, base, deserializer)
        || this.deserializeDeserializable(object, target)
        || this.deserializeDefault(object, target, deserializer, checkRequiredValue);
    } catch (err) {
      if (!(err instanceof BadRequest) && !(err instanceof InternalServerError)) {
        err = new ConverterDeserializationError(getClass(object), object, err);
      }

      throw err;
    }
  }

  public getConverter(target: any): IConverter|undefined {
    const converter = Metadata.get(CONVERTER, target);
    return converter && this.injector.get(converter);
  }

  private deserializeConverter(object: any, target: any, base: any, deserializer: IDeserializer): any {
    const converter = this.getConverter(target);
    return converter && converter.deserialize!(object, target, base, deserializer)
  }

  private deserializeIterable(object: any, base: any, deserializer: IDeserializer): any {
    return isArrayOrArrayClass(object) && this.deserializeConverter(object, Array, base, deserializer);
  }

  private deserializeDeserializable(object: any, target: any): any {
    return target.prototype && typeof target.prototype.deserialize === 'function' && new target().deserialize(object)
  }

  private serializeConverter(object: any, serializer: ISerializer) {
    const converter = this.getConverter(object);
    return converter && converter.serialize!(object, serializer);
  }

  private serializeSerializable(object: any, options: IConverterOptions) {
    if (typeof object.serialize === 'function') {
      return object.serialize(options, this);
    }

    if (typeof object.toJSON === 'function' && !object.toJSON.$ignore) {
      return object.toJSON();
    }
  }

  public serializeClass(object: any, options: IConverterOptions = {}) {
    const serializer: ISerializer = object => this.serialize(object, options);
    const { type, checkRequiredValue = true } = options;

    return this.serializeObject(object, serializer, type, checkRequiredValue);
  }
}