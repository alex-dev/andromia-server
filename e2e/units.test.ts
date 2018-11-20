import { ExpressApplication } from '@tsed/common';
import { bootstrap, inject } from '@tsed/testing';
import { describe, beforeEach, it } from 'mocha';
import { Server } from '../src/server';
import { validateUnit, validateUnits } from './validators/models';
import * as request from 'supertest';

describe('Units:', () => {
  let app: request.SuperTest<request.Test>;

  beforeEach(bootstrap(Server));
  beforeEach(inject([ExpressApplication], (express: ExpressApplication) => {
    app = request(express);
  }));

  describe('GET /units', () => {
    it('should return all known units.', done => {
      app.get('/units')
        .expect('Content-Type', 'application/json')
        .expect(200)
        .end((error, response) => {
          if (error) {
            done(error);
          }
  
          validateUnits(JSON.parse(response.text));
          done();
        });
    });
  });

  describe('GET /units/:name', () => {
    it('should return a known unit by its name.', done => {
      app.get('/units/:name')
        .expect('Content-Type', 'application/json')
        .expect(200)
        .end((error, response) => {
          if (error) {
            done(error);
          }
  
          validateUnit(JSON.parse(response.text));
          done();
        });
    });
  });
});
