import {ExpressApplication} from '@tsed/common';
import {bootstrap, inject} from '@tsed/testing';
import {expect} from 'chai';
import {describe, beforeEach, it} from 'mocha';
import {Server} from '../src/server';
import * as supertest from 'supertest';

describe('GET /sets', () => {
  let app: supertest.SuperTest<supertest.Test>;

  beforeEach(bootstrap(Server));
  beforeEach(inject([ExpressApplication], (express: ExpressApplication) => {
    app = supertest(express);
  }));

  it('should return all known sets.', done => {
    app.get('/sets')
      .expect('Content-Type', 'application/json')
      .expect(200)
      .end((err, response) => {
        if (err) {
          done(err);
        }

        const data = JSON.parse(response.text);

        expect(data).to.be.an('array').that.is.not.empty;
        data.forEach((item: any) => {
          expect(item).to.be.a('string');
        });

        done();
      });
  });
});
