import {ExpressApplication} from '@tsed/common';
import {bootstrap, inject} from '@tsed/testing';
import {expect} from 'chai';
import {describe, beforeEach, it} from 'mocha';
import {Server} from '../src/server';
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

            const data = JSON.parse(response.text);

            expect(data).to.haveOwnProperty('email').that.is.a('string');
            expect(data).to.haveOwnProperty('name').that.is.a('string');
            expect(data).to.not.haveOwnProperty('password');
            expect(data).to.haveOwnProperty('location').that.is.a('string');
            expect(data).to.haveOwnProperty('inox').that.is.a('number');
            expect(data).to.haveOwnProperty('explorations').that.is.a('string');
            expect(data).to.haveOwnProperty('units').that.is.a('string');
            expect(data).to.haveOwnProperty('runes').that.is.an('object');
            Object.entries(data.runes).forEach(([rune, count]) => {
              expect(rune).to.be.a('string');
              expect(count).to.be.a('number');
              expect(count as number % 1).to.be.equal(0);
            });

            done();
          });
      });

      it('should allow connection with expand units', done => {
        app.post('/login?extend=')
          .send({ name: 'user', password: 'valid' })
          .expect('Content-Type', 'application/json')
          .expect('Authorization')
          .expect(200)
          .end((err, response) => {
            if (err) {
              done(err);
            }

            const data = JSON.parse(response.text);

            expect(data).to.haveOwnProperty('email').that.is.a('string');
            expect(data).to.haveOwnProperty('name').that.is.a('string');
            expect(data).to.not.haveOwnProperty('password');
            expect(data).to.haveOwnProperty('location').that.is.a('string');
            expect(data).to.haveOwnProperty('inox').that.is.a('number');
            expect(data).to.haveOwnProperty('explorations').that.is.a('string');
            expect(data).to.haveOwnProperty('units').that.is.an('array');
            data.units.forEach((item: any) => {
              expect(item).to.haveOwnProperty('number').that.is.a('number'); 
              expect(item).to.haveOwnProperty('name').that.is.a('string'); 
              expect(item).to.haveOwnProperty('set').that.is.a('string'); 
              expect(item).to.haveOwnProperty('life').that.is.a('number'); 
              expect(item).to.haveOwnProperty('speed').that.is.a('number'); 
              expect(item).to.haveOwnProperty('imageURL').that.is.a('string'); 
              expect(item).to.haveOwnProperty('affinity').that.is.a('string'); 
              expect(item).to.haveOwnProperty('runes').that.is.an('object'); 
              expect(item.runes).to.haveOwnProperty('weapons').that.is.an('array'); 
              item.runes.weapons.forEach((item: any) => { 
                expect(item).to.be.a('string'); 
              }); 
              expect(item.abilities).to.haveOwnProperty('abilities').that.is.an('array'); 
              item.runes.abilities.forEach((item: any) => { 
                expect(item).to.be.a('string'); 
              }); 
            });
            expect(data).to.haveOwnProperty('runes').that.is.an('object');
            Object.entries(data.runes).forEach(([rune, count]) => {
              expect(rune).to.be.a('string');
              expect(count).to.be.a('number');
              expect(count as number % 1).to.be.equal(0);
            });

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
