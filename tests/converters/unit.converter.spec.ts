import { describe, before, it } from 'mocha';
import { expect } from 'chai';
import { inject } from '@tsed/testing';
import { ConverterService } from '../../src/services/converter.service';
import { Unit } from '../../src/models/unit';
import { validateUnit, validateUnits } from './import';

describe('Set:', () => {
  const unit = new Unit(1, 'name', 'set', 10, 10, 'an url', 'affinity', ['ability'], ['weapon']);
  const json = {
    href: 'href',
    number: 1,
    name: 'name',
    set: 'set',
    life: 10,
    speed: 10,
    imageURL: 'an url',
    affinity: 'affinity',
    runes: {
      abilities: ['ability'],
      weapons: ['weapons']
    }
  }

  let converter: ConverterService;

  before(inject([ConverterService], (_converter: ConverterService) => {
    converter = _converter
  }));

  describe('Serialization', () => {
    it('should serialize a value', () => {
      validateUnit(converter.serialize(unit));
    });

    it('should serialize an array', () => {
      validateUnits(converter.serialize([unit, unit]));
    });
  });

  describe('Deserialization', () => {
    it('should deserialize a value', () => {
      const data = converter.deserialize(json, Unit);
      expect(data).to.be.a('Unit');
    });

    it('should deserialize an array', () => {
      const data = converter.deserialize([json, json], Array, Unit);
      expect(data).to.be.a('array');
      data.forEach((item: any) => {
        expect(item).to.be.a('Unit');
      });
    });
  });
});
