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

      it('should return all units owned by explorateur', done => {
        app.get(`/explorateurs/${target.name}/explorations`)
          .set('Authorization', authorization)
          .set('Accept', 'application/hal+json')
          .expect('Content-Type', 'application/hal+json')
          .expect(200)
          .expect(response => validateCollection(JSON.parse(response.text)))
          .expect((response: request.Response) => validateExplorations(JSON.parse(response.text).items), done);
      });

      it('should return not acceptable', done => {
        app.get(`/explorateurs/${target.name}/explorations`)
          .set('Authorization', authorization)
          .set('Accept', 'text/html')
          .expect(406, done);
      });
    });

    describe('with authenticated user not being target explorateur', () => {
      beforeEach(() => {
        authorization = authenticate(other, app);
      });

      it('should return all units owned by explorateur', done => {
        app.get(`/explorateurs/${target.name}/explorations`)
          .set('Authorization', authorization)
          .set('Accept', 'application/hal+json')
          .expect('Content-Type', 'application/hal+json')
          .expect(200)
          .expect(response => validateCollection(JSON.parse(response.text)))
          .expect((response: request.Response) => validateExplorations(JSON.parse(response.text).items), done);
      });

      it('should not find user', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
          .set('Authorization', authorization)
          .set('Accept', 'application/hal+json')
          .expect(404, done);
      });

      it('should return not acceptable', done => {
        app.get(`/explorateurs/${target.name}/explorations`)
          .set('Authorization', authorization)
          .set('Accept', 'text/html')
          .expect(406, done);
      });

      it('should not find user', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
          .set('Authorization', authorization)
          .set('Accept', 'text/html')
          .expect(404, done);
      });
    });

    describe('with anonymous user', () => {
      it('should refuse access', done => {
        app.get(`/explorateurs/${target.name}/explorations`)
          .set('Accept', 'application/hal+json')
          .expect(401, done);
      });

      it('should refuse access', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
          .set('Accept', 'application/hal+json')
          .expect(401, done);
      });

      it('should refuse access', done => {
        app.get(`/explorateurs/${target.name}/explorations`)
          .set('Accept', 'text/html')
          .expect(401, done);
      });

      it('should refuse access', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
          .set('Accept', 'text/html')
          .expect(401, done);
      });
    });
  });

  describe('POST /explorateurs/{name}/explorations', () => {
    describe('with authenticated user being target explorateur', () => {      
      beforeEach(() => {
        authorization = authenticate(target, app);
      });

      it('should return all units owned by explorateur', done => {
        app.get(`/explorateurs/${target.name}/units`)
          .set('Authorization', authorization)
          .set('Accept', 'application/hal+json')
          .expect('Content-Type', 'application/hal+json')
          .expect(200)
          .expect(response => validateCollection(JSON.parse(response.text)))
          .expect((response: request.Response) => validateOwnedUnits(JSON.parse(response.text).items), done);
      });

      it('should return all units owned by explorateur', done => {
        app.get(`/explorateurs/${target.name}/units`)
          .set('Authorization', authorization)
          .set('Accept', 'text/html')
          .expect(406, done);
      });
    });

    describe('with authenticated user not being target explorateur', () => {
      beforeEach(() => {
        authorization = authenticate(other, app);
      });

      it('should refuse creation', done => {
        app.get(`/explorateurs/${target.name}/units`)
          .set('Authorization', authorization)
          .set('Accept', 'application/hal+json')
          .expect('Content-Type', 'application/hal+json')
          .expect(200)
          .expect(response => validateCollection(JSON.parse(response.text)))
          .expect((response: request.Response) => validateOwnedUnits(JSON.parse(response.text).items), done);
      });

      it('should not find user', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/units`)
          .set('Authorization', authorization)
          .set('Accept', 'application/hal+json')
          .expect(404, done);
      });

      it('should return all units owned by explorateur', done => {
        app.get(`/explorateurs/${target.name}/units`)
          .set('Authorization', authorization)
          .set('Accept', 'text/html')
          .expect(406, done);
      });

      it('should not find user', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/units`)
          .set('Authorization', authorization)
          .set('Accept', 'text/html')
          .expect(404, done);
      });
    });

    describe('with anonymous user', () => {
      it('should refuse access', done => {
        app.get(`/explorateurs/${target.name}/units`)
          .set('Accept', 'application/hal+json')
          .expect(401, done);
      });

      it('should refuse access', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/units`)
          .set('Accept', 'application/hal+json')
          .expect(401, done);
      });

      it('should refuse access', done => {
        app.get(`/explorateurs/${target.name}/units`)
          .set('Accept', 'text/html')
          .expect(401, done);
      });

      it('should refuse access', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/units`)
          .set('Accept', 'text/html')
          .expect(401, done);
      });
    });
  });

  describe('GET /explorateurs/{name}/explorations/{uuid}', () => {
    describe('with authenticated user being target explorateur', () => {
      beforeEach(() => {
        authorization = authenticate(target, app);
      });

      it('should return requested exploration', done => {
        app.get(`/explorateurs/${target.name}/explorations/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
          .set('Authorization', authorization)
          .expect('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
          .expect((response: request.Response) => validateExploration(JSON.parse(response.text)), done);
      });

      it('should not find exploration', done => {
        app.get(`/explorateurs/${target.name}/explorations/${(Entities.validUnitKeys.get(other.name) || [''])[0]}`)
          .set('Authorization', authorization)
          .set('Accept', 'application/json')
          .expect(404, done);
      });

      it('should not find exploration', done => {
        app.get(`/explorateurs/${target.name}/explorations/${Entities.invalidUnitKey}`)
          .set('Authorization', authorization)
          .set('Accept', 'application/json')
          .expect(404, done);
      });

      it('should return not acceptable', done => {
        app.get(`/explorateurs/${target.name}/explorations/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
          .set('Authorization', authorization)
          .expect('Content-Type', 'application/json')
          .set('Accept', 'text/html')
          .expect(406, done);
      });

      it('should not find exploration', done => {
        app.get(`/explorateurs/${target.name}/explorations/${(Entities.validUnitKeys.get(other.name) || [''])[0]}`)
          .set('Authorization', authorization)
          .set('Accept', 'text/html')
          .expect(404, done);
      });

      it('should not find exploration', done => {
        app.get(`/explorateurs/${target.name}/explorations/${Entities.invalidUnitKey}`)
          .set('Authorization', authorization)
          .set('Accept', 'text/html')
          .expect(404, done);
      });
    });

    describe('with authenticated user not being target explorateur', () => {
      beforeEach(() => {
        authorization = authenticate(Entities.validAuthentication[1], app);
      });

      it('should return requested explorations', done => {
        app.get(`/explorateurs/${target.name}/explorations/${Entities.validUnitKeys.get(target.name)}`)
          .set('Authorization', authorization)
          .expect('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
          .expect((response: request.Response) => validateExploration(JSON.parse(response.text)), done);
      });

      it('should not find exploration', done => {
        app.get(`/explorateurs/${target.name}/explorations/${(Entities.validUnitKeys.get(other.name) || [''])[0]}`)
          .set('Authorization', authorization)
          .set('Accept', 'application/json')
          .expect(404, done);
      });

      it('should not find exploration', done => {
        app.get(`/explorateurs/${target.name}/explorations/${Entities.invalidUnitKey}`)
          .set('Authorization', authorization)
          .set('Accept', 'application/json')
          .expect(404, done);
      });

      it('should not find user', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
          .set('Authorization', authorization)
          .set('Accept', 'application/json')
          .expect(404, done);
      });

      it('should not find user', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations/${Entities.invalidUnitKey}`)
          .set('Authorization', authorization)
          .set('Accept', 'application/json')
          .expect(404, done);
      });

      it('should return not acceptable', done => {
        app.get(`/explorateurs/${target.name}/explorations/${Entities.validUnitKeys.get(target.name)}`)
          .set('Authorization', authorization)
          .set('Accept', 'text/html')
          .expect(406, done);
      });

      it('should not find exploration', done => {
        app.get(`/explorateurs/${target.name}/explorations/${(Entities.validUnitKeys.get(other.name) || [''])[0]}`)
          .set('Authorization', authorization)
          .set('Accept', 'text/html')
          .expect(404, done);
      });

      it('should not find exploration', done => {
        app.get(`/explorateurs/${target.name}/explorations/${Entities.invalidUnitKey}`)
          .set('Authorization', authorization)
          .set('Accept', 'text/html')
          .expect(404, done);
      });

      it('should not find user', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
          .set('Authorization', authorization)
          .set('Accept', 'text/html')
          .expect(404, done);
      });

      it('should not find user', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations/${Entities.invalidUnitKey}`)
          .set('Authorization', authorization)
          .set('Accept', 'text/html')
          .expect(404, done);
      });
    });

    describe('with anonymous user', () => {
      it('should refuse access', done => {
        app.get(`/explorateurs/${target.name}/explorations/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
          .set('Accept', 'application/json')
          .expect(401, done);
      });

      it('should refuse access', done => {
        app.get(`/explorateurs/${target.name}/explorations/${(Entities.validUnitKeys.get(other.name) || [''])[0]}`)
          .set('Accept', 'application/json')
          .expect(401, done);
      });

      it('should refuse access', done => {
        app.get(`/explorateurs/${target.name}/explorations/${Entities.invalidUnitKey}`)
          .set('Accept', 'application/json')
          .expect(401, done);
      });

      it('should refuse access', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
          .set('Accept', 'application/json')
          .expect(401, done);
      });

      it('should refuse access', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations/${Entities.invalidUnitKey}`)
          .set('Accept', 'application/json')
          .expect(401, done);
      });

      it('should refuse access', done => {
        app.get(`/explorateurs/${target.name}/explorations/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
          .set('Accept', 'text/html')
          .expect(401, done);
      });

      it('should refuse access', done => {
        app.get(`/explorateurs/${target.name}/explorations/${Entities.invalidUnitKey}`)
          .set('Accept', 'text/html')
          .expect(401, done);
      });

      it('should refuse access', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
          .set('Accept', 'text/html')
          .expect(401, done);
      });

      it('should refuse access', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations/${Entities.invalidUnitKey}`)
          .set('Accept', 'text/html')
          .expect(401, done);
      });
    });
  });
});
