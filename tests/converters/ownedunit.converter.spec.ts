import { describe, before, it } from 'mocha';
import { expect } from 'chai';
import { inject, bootstrap } from '@tsed/testing';
import { ConverterService } from '@tsed/common';
import { OwnedUnit } from '../../src/models/ownedunit';
import { Unit } from '../../src/models/unit';
import { RunesHolder } from '../../src/models/runesholder';
import { validateOwnedUnit, validateOwnedUnits } from './import';
import { Ability } from '../../src/models/types';
import { Server } from '../../src/server';

describe('OwnedUnit:', () => {
  const unit = new OwnedUnit(
    'uuid', 
    new Unit(1, 'name', 'set', 10, 10, 'an url', 'affinity', new RunesHolder(['ability'], ['weapon'])),
    new Map<Ability, number>([['ability1', 1], ['ability2', 2]]));
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
    },
    uuid: 'uuid',
    kernel: { ability1: 1, ability2: 2 }
  }

  let converter: ConverterService;
  before(bootstrap(Server));
  before(inject([ConverterService], (_converter: ConverterService) => {
    converter = _converter
  }));

  describe('Serialization', () => {
    it ('should serialize a value', () => {
      validateOwnedUnit(converter.serialize(unit));
    });

    it('should serialize an array', () => {
      validateOwnedUnits(converter.serialize([unit, unit]));
    });
  });

  describe('Deserialization', () => {
    it ('should deserialize a value', () => {
      const data = converter.deserialize(json, OwnedUnit);
      expect(data).to.be.instanceof(OwnedUnit);
    });

    it('should deserialize an array', () => {
      const data = converter.deserialize([json, json], Array, OwnedUnit);
      expect(data).to.be.an('array');
      data.forEach((item: any) => {
        expect(item).to.be.instanceof(OwnedUnit);
      });
    });
  });
});
