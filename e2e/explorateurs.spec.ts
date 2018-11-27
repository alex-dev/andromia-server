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

  beforeEach(bootstrap(Server));
  beforeEach(inject([ExpressApplication], (express: ExpressApplication) => {
    app = request(express);
  }));

  describe('GET /explorateurs', () => {
    it('should return all known explorateurs', done => {
      app.get('/explorateurs')
        .set('Accept', 'application/hal+json')
        .expect('Content-Type', 'application/hal+json')
        .expect(200)
        .expect(response => validateCollection(JSON.parse(response.text)))
        .expect((response: request.Response) => validateExplorateurs(JSON.parse(response.text).items), done);
    });

    it('should return not acceptable', done => {
      app.get('/explorateurs')
        .set('Accept', 'text/html')
        .expect(406, done);
    });
  });

  describe('POST /explorateurs', () => {
    // TODO
  });

  describe('GET /explorateurs/{name}', () => {
    describe('with valid unit', () => {
      it('should return a known unit by its name', done => {
        app.get(`/explorateurs/${Entities.validAuthentication[0]}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', 'application/json')
          .expect(200)
          .expect((response: request.Response) => validateExplorateur(JSON.parse(response.text)), done);
      });

      it('should return not acceptable', done => {
        app.get(`/units/${Entities.validAuthentication[0]}`)
          .set('Accept', 'text/html')
          .expect(406, done);
      });
    });

    describe('with an invalid unit', () => {
      it('should not find unit', done => {
        app.get(`/units/${Entities.invalidAuthentication}`)
          .set('Accept', 'application/json')
          .expect(404, done);
      });

      it('should not find unit', done => {
        app.get(`/units/${Entities.invalidAuthentication}`)
          .set('Accept', 'text/html')
          .expect(404, done);
      });
    });
  });

  describe('PUT /explorateurs/{name}', () => {
    let authorization: any;

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
