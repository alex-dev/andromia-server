import { ExpressApplication } from '@tsed/common';
import { bootstrap, inject } from '@tsed/testing';
import { describe, beforeEach, it } from 'mocha';
import { Server } from '../src/server';
import { validateLocations } from './validators/models';
import * as supertest from 'supertest';

describe('Locations:', () => {
  let app: supertest.SuperTest<supertest.Test>;

  beforeEach(bootstrap(Server));
  beforeEach(inject([ExpressApplication], (express: ExpressApplication) => {
    app = supertest(express);
  }));

  describe('GET /locations', () => {
    it('should return all known locations.', done => {
      app.get('/locations')
        .expect('Content-Type', 'application/json')
        .expect(200)
        .end((err, response) => {
          if (err) {
            done(err);
          }
  
          validateLocations(JSON.parse(response.text));
          done();
        });
    });
  });
});
