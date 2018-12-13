import { describe, before, it } from 'mocha';
import { inject, bootstrap } from '@tsed/testing';
import { ConverterService } from '@tsed/common';
import { validateExplorateur, validateExplorateurs } from './import';
import { Explorateur } from '../../src/models/explorateur';
import { Server } from '../../src/server';

describe('Explorateur:', () => {
  const explorateur = new Explorateur('email', 'name', 'password');
  let converter: ConverterService;

  before(bootstrap(Server));
  before(inject([ConverterService], (_converter: ConverterService) => {
    converter = _converter
  }));

  describe('Serialization', () => {
    it ('should serialize a value', () => {
      validateExplorateur(converter.serialize(explorateur));
    });

    it('should serialize an array', () => {
      validateExplorateurs(converter.serialize([explorateur, explorateur]));
    });
  });
});
