import { ExpressApplication } from '@tsed/common';
import { bootstrap, inject } from '@tsed/testing';
import { describe, beforeEach, it } from 'mocha';
import { Server } from '../src/server';
import { validateSets } from './validators/models';
import * as supertest from 'supertest';

describe('Sets:', () => {
  let app: supertest.SuperTest<supertest.Test>;

  beforeEach(bootstrap(Server));
  beforeEach(inject([ExpressApplication], (express: ExpressApplication) => {
    app = supertest(express);
  }));

  describe('GET /sets', () => {
    it('should return all known sets.', done => {
      app.get('/sets')
        .expect('Content-Type', 'application/json')
        .expect(200)
        .end((err, response) => {
          if (err) {
            done(err);
          }
  
          validateSets(JSON.parse(response.text));
          done();
        });
    });
  });
});
