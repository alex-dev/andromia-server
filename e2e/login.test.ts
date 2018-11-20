import { ExpressApplication } from '@tsed/common';
import { bootstrap, inject } from '@tsed/testing';
import { describe, beforeEach, it } from 'mocha';
import { Server } from '../src/server';
import { validateExplorateur } from './validators/models';
import * as request from 'supertest';

describe('Login:', () => {
  let app: request.SuperTest<request.Test>;

  beforeEach(bootstrap(Server));
  beforeEach(inject([ExpressApplication], (express: ExpressApplication) => {
    app = request(express);
  }));

  describe('POST /login', () => {
    describe('with valid credentials', () => {
      it('should allow connection', done => {
        app.post('/login')
          .send({ name: 'user', password: 'valid' })
          .expect('Content-Type', 'application/json')
          .expect('Authorization')
          .expect(200)
          .end((error, response) => {
            if (error) {
              done(error);
            }

            validateExplorateur(JSON.parse(response.text), false, false);
            done();
          });
      });

      it('should allow connection with expand units', done => {
        app.post('/login?expand=units')
          .send({ name: 'user', password: 'valid' })
          .expect('Content-Type', 'application/json')
          .expect('Authorization')
          .expect(200)
          .end((error, response) => {
            if (error) {
              done(error);
            }

            validateExplorateur(JSON.parse(response.text), true, false);
            done();
          });
      });

      it('should allow connection with expand explorations', done => {
        app.post('/login?expand=explorations')
          .send({ name: 'user', password: 'valid' })
          .expect('Content-Type', 'application/json')
          .expect('Authorization')
          .expect(200)
          .end((error, response) => {
            if (error) {
              done(error);
            }

            validateExplorateur(JSON.parse(response.text), false, true);
            done();
          });
      });

      it('should allow connection with expand explorations and units', done => {
        app.post('/login?expend=explorations,units')
          .send({ name: 'user', password: 'valid' })
          .expect('Content-Type', 'application/json')
          .expect('Authorization')
          .expect(200)
          .end((error, response) => {
            if (error) {
              done(error);
            }

            validateExplorateur(JSON.parse(response.text), true, false);
            done();
          });
      });
    });

    describe('with invalid credentials', () => {
      it('should refuse connection', done => {
        app.post('/login')
          .send({ name: 'user', password: 'invalid' })
          .expect(401)
          .end((error, response) => {
            if (error) {
              done(error);
            }

            done();
          });
      });
    });

    describe('with unprocessable body', () => {
      it('should inform', done => {
        app.post('/login')
          .send({ name: 'user' })
          .expect(422)
          .end((error, response) => {
            if (error) {
              done(error);
            }

            done();
          });
      });
    });
  });
});
