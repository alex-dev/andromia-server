import { ExpressApplication } from '@tsed/common';
import { bootstrap, inject } from '@tsed/testing';
import { describe, beforeEach, it } from 'mocha';
import { Server } from '../src/server';
import { validateExplorateur } from './validators/models';
import * as supertest from 'supertest';

describe('Login:', () => {
  let app: supertest.SuperTest<supertest.Test>;

  beforeEach(bootstrap(Server));
  beforeEach(inject([ExpressApplication], (express: ExpressApplication) => {
    app = supertest(express);
  }));

  describe('POST /login', () => {
    describe('with valid credentials', () => {
      it('should allow connection', done => {
        app.post('/login')
          .send({ name: 'user', password: 'valid' })
          .expect('Content-Type', 'application/json')
          .expect('Authorization')
          .expect(200)
          .end((err, response) => {
            if (err) {
              done(err);
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
          .end((err, response) => {
            if (err) {
              done(err);
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
          .end((err, response) => {
            if (err) {
              done(err);
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
          .end((err, response) => {
            if (err) {
              done(err);
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
          .end((err, response) => {
            if (err) {
              done(err);
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
          .end((err, response) => {
            if (err) {
              done(err);
            }

            done();
          });
      });
    });
  });
});
