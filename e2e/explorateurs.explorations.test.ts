import { ExpressApplication } from '@tsed/common';
import { bootstrap, inject } from '@tsed/testing';
import { describe, beforeEach, it } from 'mocha';
import { Server } from '../src/server';
import { authenticate } from './authenticator/authenticator';
import { Entities } from './database/entities';
import { validateCollection } from './validators/halson';
import { validateExploration, validateExplorations } from './validators/models';
import * as request from 'supertest';

describe("Explorateur's units:", () => {
  const target = Entities.validAuthentication[0];
  const other = Entities.validAuthentication[1];

  let app: request.SuperTest<request.Test>;
  let authorization: any;

  beforeEach(bootstrap(Server));
  beforeEach(inject([ExpressApplication], (express: ExpressApplication) => {
    app = request(express);
  }));

  describe('GET /explorateurs/{name}/explorations', () => {
    describe('with authenticated user being target explorateur', () => {      
      beforeEach(() => {
        authorization = authenticate(target, app);
      });

      it('should return all explorations done by explorateur', done => {
        app.get(`/explorateurs/${target.name}/explorations`)
          .set('Authorization', authorization)
          .expect('Content-Type', 'application/hal+json')
          .expect(200)
          .expect(response => validateCollection(JSON.parse(response.text)))
          .expect((response: request.Response) => validateExplorations(JSON.parse(response.text).items), done);
      });
    });

    describe('with authenticated user not being target explorateur', () => {
      beforeEach(() => {
        authorization = authenticate(other, app);
      });

      it('should return all explorations done by explorateur', done => {
        app.get(`/explorateurs/${target.name}/explorations`)
          .set('Authorization', authorization)
          .expect('Content-Type', 'application/hal+json')
          .expect(200)
          .expect(response => validateCollection(JSON.parse(response.text)))
          .expect((response: request.Response) => validateExplorations(JSON.parse(response.text).items), done);
      });

      it('should not find user', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
          .set('Authorization', authorization)
          .expect(404, done);
      });
    });

    describe('with anonymous user', () => {
      it('should refuse access', done => {
        app.get(`/explorateurs/${target.name}/explorations`)
          .expect(401, done);
      });

      it('should refuse access', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
          .expect(401, done);
      });
    });
  });

  describe('GET /explorateurs/{name}/units/{uuid}', () => {
    describe('with authenticated user being target explorateur', () => {
      beforeEach(() => {
        authorization = authenticate(target, app);
      });

      it('should return requested unit', done => {
        app.get(`/explorateurs/${target.name}/units/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
          .set('Authorization', authorization)
          .expect('Content-Type', 'application/json')
          .expect(200)
          .expect((response: request.Response) => validateOwnedUnit(JSON.parse(response.text)), done);
      });

      it('should not find unit', done => {
        app.get(`/explorateurs/${target.name}/units/${(Entities.validUnitKeys.get(other.name) || [''])[0]}`)
          .set('Authorization', authorization)
          .expect(404, done);
      });

      it('should not find unit', done => {
        app.get(`/explorateurs/${target.name}/units/${Entities.invalidUnitKey}`)
          .set('Authorization', authorization)
          .expect(404, done);
      });
    });

    describe('with authenticated user not being target explorateur', () => {
      beforeEach(() => {
        authorization = authenticate(Entities.validAuthentication[1], app);
      });

      it('should return requested unit', done => {
        app.get(`/explorateurs/${target.name}/units/${Entities.validUnitKeys.get(target.name)}`)
          .set('Authorization', authorization)
          .expect('Content-Type', 'application/json')
          .expect(200)
          .expect((response: request.Response) => validateOwnedUnit(JSON.parse(response.text)), done);
      });

      it('should not find unit', done => {
        app.get(`/explorateurs/${target.name}/units/${(Entities.validUnitKeys.get(other.name) || [''])[0]}`)
          .set('Authorization', authorization)
          .expect(404, done);
      });

      it('should not find unit', done => {
        app.get(`/explorateurs/${target.name}/units/${Entities.invalidUnitKey}`)
          .set('Authorization', authorization)
          .expect(404, done);
      });

      it('should not find user', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/units/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
          .set('Authorization', authorization)
          .expect(404, done);
      });

      it('should not find user', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/units/${Entities.invalidUnitKey}`)
          .set('Authorization', authorization)
          .expect(404, done);
      });
    });

    describe('with anonymous user', () => {
      it('should refuse access', done => {
        app.get(`/explorateurs/${target.name}/units/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
          .expect(401, done);
      });

      it('should refuse access', done => {
        app.get(`/explorateurs/${target.name}/units/${(Entities.validUnitKeys.get(other.name) || [''])[0]}`)
        .expect(401, done);
      });

      it('should refuse access', done => {
        app.get(`/explorateurs/${target.name}/units/${Entities.invalidUnitKey}`)
        .expect(401, done);
      });

      it('should refuse access', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/units/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
        .expect(401, done);
      });

      it('should refuse access', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/units/${Entities.invalidUnitKey}`)
        .expect(401, done);
      });
    });
  });
});
