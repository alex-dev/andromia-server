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
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json')
        .expect(200)
        .expect((response: request.Response) => validateLocations(JSON.parse(response.text)), done);
    });

    it('should return not acceptable', done => {
      app.get('/locations')
        .set('Accept', 'text/html')
        .expect(406, done);
    });
  });
});
