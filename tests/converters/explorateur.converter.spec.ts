import { describe, before, it } from 'mocha';
import { expect } from 'chai';
import { inject } from '@tsed/testing';
import { ConverterService } from '@tsed/common';
import { OwnedUnit } from '../../src/models/ownedunit';
import { validateExplorateur, validateExplorateurs } from './import';
import { Ability } from '../../src/models/types';
import { Explorateur } from '../../src/models/explorateur';

describe('Explorateur:', () => {
  const unit = new Explorateur('email', 'name', 'password');
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

  before(inject([ConverterService], (_converter: ConverterService) => {
    converter = _converter
  }));

  describe('Serialization', () => {
    it ('should serialize a value', () => {
      validateExplorateur(converter.serialize(unit));
    });

    it('should serialize an array', () => {
      validateExplorateurs(converter.serialize([unit, unit]));
    });
  });

  describe('Deserialization', () => {
    it ('should deserialize a value', () => {
      const data = converter.deserialize(json, OwnedUnit);
      expect(data).to.be.a('OwnedUnit');
    });

    it('should deserialize an array', () => {
      const data = converter.deserialize([json, json], Array, OwnedUnit);
      expect(data).to.be.a('array');
      data.forEach((item: any) => {
        expect(item).to.be.a('OwnedUnit');
      });
    });
  });
});
