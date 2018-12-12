import { describe, before, it } from 'mocha';
import { expect } from 'chai';
import { inject } from '@tsed/testing';
import { ConverterService } from '@tsed/common';
import { Exploration } from '../../src/models/exploration';
import { validateExploration, validateExplorations } from './import';

describe('Exploration:', () => {
  let converter: ConverterService;

  before(inject([ConverterService], (_converter: ConverterService) => {
    converter = _converter
  }));

  describe('Without runes and unit', () => {
    const exploration = new Exploration(new Date(), new Date(), 'destination');
    exploration.from = 'inoxis';
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
  
    describe('Serialization', () => {
      it ('should serialize a value', () => {
        validateExploration(converter.serialize(exploration));
      });

      it('should serialize an array', () => {
        validateExplorations(converter.serialize([exploration, exploration]));
      });
    });

    describe('Deserialization', () => {
      it ('should deserialize a value', () => {
        const data = converter.deserialize(json, Exploration);
        expect(data).to.be.an('Exploration');
      });

      it('should deserialize an array', () => {
        const data = converter.deserialize([json, json], Array, Exploration);
        expect(data).to.be.an('array');
        data.forEach((item: any) => {
          expect(item).to.be.an('Exploration');
        });
      });
    });
  });
});
