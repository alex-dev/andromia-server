import {ExpressApplication} from '@tsed/common';
import {bootstrap, inject} from '@tsed/testing';
import {describe, beforeEach, it} from 'mocha';
import {Server} from '../src/server';
import {validateUnit, validateUnits} from './validators/models';
import * as supertest from 'supertest';

describe('Units:', () => {
  let app: supertest.SuperTest<supertest.Test>;

  beforeEach(bootstrap(Server));
  beforeEach(inject([ExpressApplication], (express: ExpressApplication) => {
    app = supertest(express);
  }));

  describe('GET /units', () => {
    it('should return all known units.', done => {
      app.get('/units')
        .expect('Content-Type', 'application/json')
        .expect(200)
        .end((err, response) => {
          if (err) {
            done(err);
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
        .end((err, response) => {
          if (err) {
            done(err);
          }
  
          validateUnit(JSON.parse(response.text));
          done();
        });
    });
  });
});
