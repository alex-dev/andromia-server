import { ExpressApplication } from '@tsed/common';
import { bootstrap, inject } from '@tsed/testing';
import { describe, beforeEach, it } from 'mocha';
import { Server } from '../src/server';
import { authenticate } from './authenticator/authenticator';
import { Entities } from './database/entities';
import { validateRunesCounts } from './validators/models';
import * as request from 'supertest';

describe("Explorateur's runes", () => {
  const target = Entities.validAuthentication[0];
  const other = Entities.validAuthentication[1];

  let app: request.SuperTest<request.Test>;
  let authorization: any;

  beforeEach(bootstrap(Server));
  beforeEach(inject([ExpressApplication], (express: ExpressApplication) => {
    app = request(express);
  }));

  describe('GET /explorateurs/{name}/runes', () => {
    describe('with authenticated user being target explorateur', () => {      
      beforeEach(() => {
        authorization = authenticate(target, app);
      });

      it('should return runes', done => {
        app.get(`/explorateurs/${target.name}/runes`)
          .set('Authorization', authorization)
          .set('Accept', 'application/json')
          .expect('Content-Type', 'application/json')
          .expect(200)
          .expect((response: request.Response) => validateRunesCounts(JSON.parse(response.text)), done);
      });

      it('should return not acceptable', done => {
        app.get(`/explorateurs/${target.name}/runes`)
          .set('Authorization', authorization)
          .set('Accept', 'text/html')
          .expect(406, done);
      });
    });

    describe('with authenticated user not being target explorateur', () => {
      beforeEach(() => {
        authorization = authenticate(other, app);
      });

      describe('with valid explorateur', () => {
        it('should return runes', done => {
          app.get(`/explorateurs/${target.name}/runes`)
            .set('Authorization', authorization)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((response: request.Response) => validateRunesCounts(JSON.parse(response.text)), done);
        });
        
        it('should return not acceptable', done => {
          app.get(`/explorateurs/${target.name}/runes`)
            .set('Authorization', authorization)
            .set('Accept', 'text/html')
            .expect(406, done);
        });
      });

      describe('with invalid explorateur', () => {
        it('should not find user', done => {
          app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/runes`)
            .set('Authorization', authorization)
            .set('Accept', 'application/json')
            .expect(404, done);
        });

        it('should not find user', done => {
          app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/runes`)
            .set('Authorization', authorization)
            .set('Accept', 'text/html')
            .expect(404, done);
        });
      });
    });

    describe('with anonymous user', () => {
      describe('with valid explorateur', () => {
        it('should refuse access', done => {
          app.get(`/explorateurs/${target.name}/runes`)
            .set('Accept', 'application/json')
            .expect(401, done);
        });
        
        it('should refuse access', done => {
          app.get(`/explorateurs/${target.name}/runes`)
            .set('Accept', 'text/html')
            .expect(401, done);
        });
      });

      describe('with invalid explorateur', () => {
        it('should refuse access', done => {
          app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/runes`)
            .set('Accept', 'application/json')
            .expect(401, done);
        });

        it('should refuse access', done => {
          app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/runes`)
            .set('Accept', 'text/html')
            .expect(401, done);
        });
      });
    });
  });
});
