import { describe, before, it } from 'mocha';
import { expect } from 'chai';
import { inject, bootstrap } from '@tsed/testing';
import { ConverterService } from '../../src/services/converter.service';
import { Unit } from '../../src/models/unit';
import { RunesHolder } from '../../src/models/runesholder';
import { validateUnit, validateUnits } from './import';
import { Server } from '../../src/server';

describe('Unit:', () => {
  const unit = new Unit(1, 'name', 'set', 10, 10, 'an url', 'affinity', new RunesHolder(['ability'], ['weapon']));
  const json = {
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
  before(bootstrap(Server));
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
      expect(data).to.be.instanceof(Unit);
    });

    it('should deserialize an array', () => {
      const data = converter.deserialize([json, json], Array, Unit);
      expect(data).to.be.an('array');
      data.forEach((item: any) => {
        expect(item).to.be.instanceof(Unit);
      });
    });
  });
});
