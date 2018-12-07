import { ExpressApplication } from '@tsed/common';
import { bootstrap, inject } from '@tsed/testing';
import { describe, beforeEach, it } from 'mocha';
import { Server } from '../src/server';
import { authenticate } from './authenticator/authenticator';
import { Entities } from './database/entities';
import { validateExplorateur, validateExploration, validateExplorations } from './validators/models';
import * as moment from 'moment';
import * as request from 'supertest';

describe('Explorations creation details:', () => {
  const target = Entities.validAuthentication[0];

  let app: request.SuperTest<request.Test>;
  let authorization: any;

  beforeEach(bootstrap(Server));
  beforeEach(inject([ExpressApplication], (express: ExpressApplication) => {
    app = request(express);
  }));
  beforeEach(done => {
    authenticate(target, app, res => authorization = res, done);
  });

  describe('with no unit found during exploration', () => {

  });

  describe('with a known unit found during exploration', () => {

  });

  describe('with an unknown unit found during exploration', () => {
    
  });
});