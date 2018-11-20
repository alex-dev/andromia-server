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
        .expect('Content-Type', 'application/json')
        .expect(200)
        .end((error, response) => {
          if (error) {
            done(error);
          }
  
          validateRunes(JSON.parse(response.text));
          done();
        });
    });
  });

  describe('GET /runes/weapons', () => {
    it('should return all known weapons.', done => {
      app.get('/runes/weapons')
        .expect('Content-Type', 'application/json')
        .expect(200)
        .end((error, response) => {
          if (error) {
            done(error);
          }
  
          validateRunes(JSON.parse(response.text));
          done();
        });
    });
  });

  describe('GET /runes/abilities', () => {
    it('should return all known abilities.', done => {
      app.get('/runes/abilities')
        .expect('Content-Type', 'application/json')
        .expect(200)
        .end((error, response) => {
          if (error) {
            done(error);
          }
  
          validateRunes(JSON.parse(response.text));
          done();
        });
    });
  });
});