import { ExpressApplication } from '@tsed/common';
import { bootstrap, inject } from '@tsed/testing';
import { describe, beforeEach, it } from 'mocha';
import { Server } from '../src/server';
import { validateSets } from './validators/models';
import * as request from 'supertest';

describe('Sets:', () => {
  let app: request.SuperTest<request.Test>;

  beforeEach(bootstrap(Server));
  beforeEach(inject([ExpressApplication], (express: ExpressApplication) => {
    app = request(express);
  }));

  describe('GET /sets', () => {
    it('should return all known sets.', done => {
      app.get('/sets')
        .expect('Content-Type', 'application/json')
        .expect(200)
        .end((error, response) => {
          if (error) {
            done(error);
          }
  
          validateSets(JSON.parse(response.text));
          done();
        });
    });
  });
});
