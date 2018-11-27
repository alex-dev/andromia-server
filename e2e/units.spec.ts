import { ExpressApplication } from '@tsed/common';
import { bootstrap, inject } from '@tsed/testing';
import { describe, beforeEach, it } from 'mocha';
import { Server } from '../src/server';
import { Entities } from './database/entities';
import { validateCollection } from './validators/halson';
import { validateUnit, validateUnits } from './validators/models';
import * as request from 'supertest';

describe('Units:', () => {
  let app: request.SuperTest<request.Test>;

  beforeEach(bootstrap(Server));
  beforeEach(inject([ExpressApplication], (express: ExpressApplication) => {
    app = request(express);
  }));

  describe('GET /units', () => {
    it('should return all known units', done => {
      app.get('/units')
        .set('Accept', 'application/hal+json')
        .expect('Content-Type', 'application/hal+json')
        .expect(200)
        .expect(response => validateCollection(JSON.parse(response.text)))
        .expect((response: request.Response) => validateUnits(JSON.parse(response.text).items), done);
    });

    it('should return not acceptable', done => {
      app.get('/units')
        .set('Accept', 'text/html')
        .expect(406, done);
    });
  });

  describe('GET /units/:name', () => {
    describe('with valid unit', () => {
      it('should return a known unit by its name', done => {
        app.get(`/units/${Entities.validUnit}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', 'application/json')
          .expect(200)
          .expect((response: request.Response) => validateUnit(JSON.parse(response.text)), done);
      });

      it('should return not acceptable', done => {
        app.get(`/units/${Entities.validUnit}`)
          .set('Accept', 'text/html')
          .expect(406, done);
      });
    });

    describe('with an invalid unit', () => {
      it('should not find unit', done => {
        app.get(`/units/${Entities.invalidUnit}`)
          .set('Accept', 'application/json')
          .expect(404, done);
      });

      it('should not find unit', done => {
        app.get(`/units/${Entities.invalidUnit}`)
          .set('Accept', 'text/html')
          .expect(404, done);
      });
    });
  });
});
