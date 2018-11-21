import { ExpressApplication } from '@tsed/common';
import { bootstrap, inject } from '@tsed/testing';
import { describe, beforeEach, it } from 'mocha';
import { Server } from '../src/server';
import { authenticate } from './authenticator/authenticator';
import { Entities } from './database/entities';
import { validateCollection } from './validators/halson';
import { validateExplorateur, validateExplorateurs } from './validators/models';
import * as request from 'supertest';

describe("Explorateur:", () => {
  const target = Entities.validAuthentication[0];
  const other = Entities.validAuthentication[1];

  let app: request.SuperTest<request.Test>;
  let authorization: any;

  beforeEach(bootstrap(Server));
  beforeEach(inject([ExpressApplication], (express: ExpressApplication) => {
    app = request(express);
  }));

  describe('GET /explorateurs', () => {
    // TODO
  });

  describe('POST /explorateurs', () => {
    // TODO
  });

  describe('GET /explorateurs/{name}', () => {
    // TODO
  });

  describe('PUT /explorateurs/{name}', () => {
    describe('with authenticated user being target explorateur', () => {      
      beforeEach(() => {
        authorization = authenticate(target, app);
      });

      // TODO
    });

    describe('with authenticated user not being target explorateur', () => {
      beforeEach(() => {
        authorization = authenticate(other, app);
      });

      // TODO
    });

    describe('with anonymous user', () => {
      // TODO
    });
  });
});
