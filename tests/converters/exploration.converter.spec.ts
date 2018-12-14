import { describe, before, it } from 'mocha';
import { expect } from 'chai';
import { inject, bootstrap } from '@tsed/testing';
import { ConverterService } from '@tsed/common';
import { Exploration } from '../../src/models/exploration';
import { Ability } from '../../src/models/types';
import { validateExploration, validateExplorations } from './import';
import { Unit } from '../../src/models/unit';
import { RunesHolder } from '../../src/models/runesholder';
import { UnitResult } from '../../src/models/unitresult';
import { OwnedUnit } from '../../src/models/ownedunit';
import { Server } from '../../src/server';
import { ResponseSerializerService } from '../../src/services/responseSerializer.service';
import { Explorateur } from '../../src/models/explorateur';

describe('Exploration:', () => {
  const explorateur = new Explorateur('email@email.com', 'test', '123');
  
  let converter: ConverterService;
  let serializer: ResponseSerializerService;
  before(bootstrap(Server));
  before(inject([ConverterService, ResponseSerializerService], (_converter: ConverterService, _serializer: ResponseSerializerService) => {
    converter = _converter;
    serializer = _serializer;
  }));

  describe('Without runes and unit', () => {
    const exploration = new Exploration(new Date(), new Date(), 'destination');
    exploration.explorateur = explorateur;
    exploration.from = 'inoxis';
    const json = {
      started: new Date().toJSON(),
      ended: new Date().toJSON(),
      to: 'Inopxis'
    }
  
    describe('Serialization', () => {
      it ('should serialize a value', () => {
        validateExploration(serializer.serialize(exploration));
      });

      it('should serialize an array', () => {
        validateExplorations(serializer.serialize([exploration, exploration]));
      });
    });

    describe('Deserialization', () => {
      it ('should deserialize a value', () => {
        const data = converter.deserialize(json, Exploration);
        expect(data).to.be.instanceof(Exploration);
      });

      it('should deserialize an array', () => {
        const data = converter.deserialize([json, json], Array, Exploration);
        expect(data).to.be.an('array');
        data.forEach((item: any) => {
          expect(item).to.be.instanceof(Exploration);
        });
      });
    });
  });

  describe('With runes and without unit', () => {
    const exploration = new Exploration(new Date(), new Date(), 'destination', null, new Map<Ability, number>([
      ['a', 1],
      ['b', 2]
    ]));
    exploration.explorateur = explorateur;
    exploration.from = 'inoxis';
    const json = {
      started: new Date().toJSON(),
      ended: new Date().toJSON(),
      to: 'Inopxis',
      runes: {
        a: 1,
        b: 2
      }
    }
  
    describe('Serialization', () => {
      it ('should serialize a value', () => {
        validateExploration(serializer.serialize(exploration));
      });

      it('should serialize an array', () => {
        validateExplorations(serializer.serialize([exploration, exploration]));
      });
    });

    describe('Deserialization', () => {
      it ('should deserialize a value', () => {
        const data = converter.deserialize(json, Exploration);
        expect(data).to.be.instanceof(Exploration);
      });

      it('should deserialize an array', () => {
        const data = converter.deserialize([json, json], Array, Exploration);
        expect(data).to.be.an('array');
        data.forEach((item: any) => {
          expect(item).to.be.instanceof(Exploration);
        });
      });
    });
  });

  describe('Without runes and with unit', () => {
    const exploration = new Exploration(new Date(), new Date(), 'destination', new UnitResult(
      new OwnedUnit('dsf', new Unit(1, 'dsf', 'a', 10, 11, 'dsf', 's', new RunesHolder([], [])), new Map<Ability, number>()),
      false));
    exploration.explorateur = explorateur;
    exploration.from = 'inoxis';
    const json = {
      started: new Date().toJSON(),
      ended: new Date().toJSON(),
      to: 'Inopxis',
      unit: {
        unit: {
          uuid: 'dsf',
          unit: {
            number: 1,
            name: 'dsf',
            set: 'a',
            life: 10,
            speed: 11,
            imageURL: 'dsf',
            affinity: 's',
            runes: {
              abilities: [],
              weapons: []
            }
          },
          kernel: {}
        },
        accepted: false
      }
    }
  
    describe('Serialization', () => {
      it ('should serialize a value', () => {
        validateExploration(serializer.serialize(exploration));
      });

      it('should serialize an array', () => {
        validateExplorations(serializer.serialize([exploration, exploration]));
      });
    });

    describe('Deserialization', () => {
      it ('should deserialize a value', () => {
        const data = converter.deserialize(json, Exploration);
        expect(data).to.be.instanceof(Exploration);
      });

      it('should deserialize an array', () => {
        const data = converter.deserialize([json, json], Array, Exploration);
        expect(data).to.be.an('array');
        data.forEach((item: any) => {
          expect(item).to.be.instanceof(Exploration);
        });
      });
    });
  });

  describe('With runes and unit', () => {
    const exploration = new Exploration(new Date(), new Date(), 'destination', new UnitResult(
      new OwnedUnit('dsf', new Unit(1, 'dsf', 'a', 10, 11, 'dsf', 's', new RunesHolder([], [])), new Map<Ability, number>()),
      false), new Map<Ability, number>([
        ['a', 1],
        ['b', 2]
      ]));
    exploration.explorateur = explorateur;
    exploration.from = 'inoxis';
    const json = {
      started: new Date().toJSON(),
      ended: new Date().toJSON(),
      to: 'Inopxis',
      unit: {
        unit: {
          uuid: 'dsf',
          unit: {
            number: 1,
            name: 'dsf',
            set: 'a',
            life: 10,
            speed: 11,
            imageURL: 'dsf',
            affinity: 's',
            runes: {
              abilities: [],
              weapons: []
            }
          },
          kernel: {}
        },
        accepted: false
      },
      runes: {
        a: 1,
        b: 2
      }
    }
  
    describe('Serialization', () => {
      it ('should serialize a value', () => {
        validateExploration(serializer.serialize(exploration));
      });

      it('should serialize an array', () => {
        validateExplorations(serializer.serialize([exploration, exploration]));
      });
    });

    describe('Deserialization', () => {
      it ('should deserialize a value', () => {
        const data = converter.deserialize(json, Exploration);
        expect(data).to.be.instanceof(Exploration);
      });

      it('should deserialize an array', () => {
        const data = converter.deserialize([json, json], Array, Exploration);
        expect(data).to.be.an('array');
        data.forEach((item: any) => {
          expect(item).to.be.instanceof(Exploration);
        });
      });
    });
  });
});
