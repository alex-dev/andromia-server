import { describe, before, it } from 'mocha';
import { inject, bootstrap } from '@tsed/testing';
import { ConverterService } from '@tsed/common';
import { validateExplorateur, validateExplorateurs } from './import';
import { Explorateur } from '../../src/models/explorateur';
import { Server } from '../../src/server';
import { ResponseSerializerService } from '../../src/services/responseSerializer.service';

describe('Explorateur:', () => {
  const explorateur = new Explorateur('email', 'name', 'password');
  
  let converter: ConverterService;
  let serializer: ResponseSerializerService;
  before(bootstrap(Server));
  before(inject([ConverterService, ResponseSerializerService], (_converter: ConverterService, _serializer: ResponseSerializerService) => {
    converter = _converter;
    serializer = _serializer;
  }));

  describe('Serialization', () => {
    it ('should serialize a value', () => {
      validateExplorateur(serializer.serialize(explorateur));
    });

    it('should serialize an array', () => {
      validateExplorateurs(serializer.serialize([explorateur, explorateur]));
    });
  });
});
