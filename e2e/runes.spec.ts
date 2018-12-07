import { ExpressApplication } from '@tsed/common';
import { bootstrap, inject } from '@tsed/testing';
import { describe, beforeEach, it } from 'mocha';
import { Server } from '../src/server';
import { validateRunes } from './validators/models';
import * as request from 'supertest';

describe('Runes:', () => {
  let app: request.SuperTest<request.Test>;

  beforeEach(bootstrap(Server));
  beforeEach(inject([ExpressApplication], (express: ExpressApplication) => {
    app = request(express);
  }));

  describe('GET /runes', () => {
    it('should return all known runes.', done => {
      app.get('/runes')
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json')
        .expect(200)
        .expect((response: request.Response) => validateRunes(JSON.parse(response.text)), done);
    });

    it('should return not acceptable', done => {
      app.get('/runes')
        .set('Accept', 'text/plain')
        .expect(406, done);
    });
  });

  describe('GET /runes/weapons', () => {
    it('should return all known weapons.', done => {
      app.get('/runes/weapons')
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json')
        .expect(200)
        .expect((response: request.Response) => validateRunes(JSON.parse(response.text)), done);
    });

    it('should return not acceptable', done => {
      app.get('/runes/weapons')
        .set('Accept', 'text/plain')
        .expect(406, done);
    });
  });

  describe('GET /runes/abilities', () => {
    it('should return all known abilities.', done => {
      app.get('/runes/abilities')
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json')
        .expect(200)
        .expect((response: request.Response) => validateRunes(JSON.parse(response.text)), done);
    });

    it('should return not acceptable', done => {
      app.get('/runes/abilities')
        .set('Accept', 'text/plain')
        .expect(406, done);
    });
  });
});
