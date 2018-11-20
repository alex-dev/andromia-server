import { ExpressApplication } from '@tsed/common';
import { bootstrap, inject } from '@tsed/testing';
import { describe, beforeEach, it } from 'mocha';
import { Server } from '../src/server';
import { validateLocations } from './validators/models';
import * as request from 'supertest';

describe('Locations:', () => {
  let app: request.SuperTest<request.Test>;

  beforeEach(bootstrap(Server));
  beforeEach(inject([ExpressApplication], (express: ExpressApplication) => {
    app = request(express);
  }));

  describe('GET /locations', () => {
    it('should return all known locations.', done => {
      app.get('/locations')
        .expect('Content-Type', 'application/json')
        .expect(200)
        .end((error, response) => {
          if (error) {
            done(error);
          }
  
          validateLocations(JSON.parse(response.text));
          done();
        });
    });
  });
});