import { ExpressApplication } from '@tsed/common';
import { bootstrap, inject } from '@tsed/testing';
import { describe, beforeEach, it } from 'mocha';
import { Server } from '../src/server';
import { authenticate } from './authenticator/authenticator';
import { Entities } from './database/entities';
import { validateCollection } from './validators/halson';
import { validateOwnedUnit, validateOwnedUnits } from './validators/models';
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

  describe('GET /explorateurs/{name}/units', () => {
    describe('with authenticated user being target explorateur', () => {      
      beforeEach(done => {
        authenticate(target, app, res => authorization = res, done);
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

      it('should return not acceptable', done => {
        app.get(`/explorateurs/${target.name}/units`)
          .set('Authorization', authorization)
          .set('Accept', 'text/plain')
          .expect(406, done);
      });
    });

    describe('with authenticated user not being target explorateur', () => {
      beforeEach(done => {
        authenticate(other, app, res => authorization = res, done);
      });

      describe('with valid explorateur', () => {
        it('should return all units owned by explorateur', done => {
          app.get(`/explorateurs/${target.name}/units`)
            .set('Authorization', authorization)
            .set('Accept', 'application/hal+json')
            .expect('Content-Type', 'application/hal+json')
            .expect(200)
            .expect(response => validateCollection(JSON.parse(response.text)))
            .expect((response: request.Response) => validateOwnedUnits(JSON.parse(response.text).items), done);
        });

        it('should return not acceptable', done => {
          app.get(`/explorateurs/${target.name}/units`)
            .set('Authorization', authorization)
            .set('Accept', 'text/plain')
            .expect(406, done);
        });
      });

      describe('with invalid explorateur', () => {
        it('should not find user', done => {
          app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/units`)
            .set('Authorization', authorization)
            .set('Accept', 'application/hal+json')
            .expect(404, done);
        });

        it('should not find user', done => {
          app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/units`)
            .set('Authorization', authorization)
            .set('Accept', 'text/plain')
            .expect(404, done);
        });
      });
    });

    describe('with anonymous user', () => {
      describe('with valid explorateur', () => {
        it('should refuse access', done => {
          app.get(`/explorateurs/${target.name}/units`)
            .set('Accept', 'application/hal+json')
            .expect(401, done);
        });

        it('should refuse access', done => {
          app.get(`/explorateurs/${target.name}/units`)
            .set('Accept', 'text/plain')
            .expect(401, done);
        });
      });

      describe('with invalid explorateur', () => {
        it('should refuse access', done => {
          app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/units`)
            .set('Accept', 'application/hal+json')
            .expect(401, done);
        });

        it('should refuse access', done => {
          app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/units`)
            .set('Accept', 'text/plain')
            .expect(401, done);
        });
      });
    });
  });

  describe('GET /explorateurs/{name}/units/{uuid}', () => {
    describe('with authenticated user being target explorateur', () => {
      beforeEach(done => {
        authenticate(target, app, res => authorization = res, done);
      });

      describe('with valid unit', () => {
        it('should return requested unit', done => {
          app.get(`/explorateurs/${target.name}/units/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
            .set('Authorization', authorization)
            .expect('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .expect((response: request.Response) => validateOwnedUnit(JSON.parse(response.text)), done);
        });

        it('should return not acceptable', done => {
          app.get(`/explorateurs/${target.name}/units/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
            .set('Authorization', authorization)
            .expect('Content-Type', 'application/json')
            .set('Accept', 'text/plain')
            .expect(406, done);
        });
      });

      describe("with another explorateur's unit", () => {
        it('should not find unit', done => {
          app.get(`/explorateurs/${target.name}/units/${(Entities.validUnitKeys.get(other.name) || [''])[0]}`)
            .set('Authorization', authorization)
            .set('Accept', 'application/json')
            .expect(404, done);
        });

        it('should not find unit', done => {
          app.get(`/explorateurs/${target.name}/units/${(Entities.validUnitKeys.get(other.name) || [''])[0]}`)
            .set('Authorization', authorization)
            .set('Accept', 'text/plain')
            .expect(404, done);
        });
      });

      describe('with an invalid unit', () => {
        it('should not find unit', done => {
          app.get(`/explorateurs/${target.name}/units/${Entities.invalidUnitKey}`)
            .set('Authorization', authorization)
            .set('Accept', 'application/json')
            .expect(404, done);
        });

        it('should not find unit', done => {
          app.get(`/explorateurs/${target.name}/units/${Entities.invalidUnitKey}`)
            .set('Authorization', authorization)
            .set('Accept', 'text/plain')
            .expect(404, done);
        });
      });
    });

    describe('with authenticated user not being target explorateur', () => {
      beforeEach(done => {
        authenticate(other, app, res => authorization = res, done);
      });

      describe('with valid explorateur', () => {
        describe('with valid unit', () => {
          it('should return requested unit', done => {
            app.get(`/explorateurs/${target.name}/units/${Entities.validUnitKeys.get(target.name)}`)
              .set('Authorization', authorization)
              .expect('Content-Type', 'application/json')
              .set('Accept', 'application/json')
              .expect(200)
              .expect((response: request.Response) => validateOwnedUnit(JSON.parse(response.text)), done);
          });

          it('should return not acceptable', done => {
            app.get(`/explorateurs/${target.name}/units/${Entities.validUnitKeys.get(target.name)}`)
              .set('Authorization', authorization)
              .set('Accept', 'text/plain')
              .expect(406, done);
          });
        });

        describe("with another explorateur's unit", () => {
          it('should not find unit', done => {
            app.get(`/explorateurs/${target.name}/units/${(Entities.validUnitKeys.get(other.name) || [''])[0]}`)
              .set('Authorization', authorization)
              .set('Accept', 'application/json')
              .expect(404, done);
          });

          it('should not find unit', done => {
            app.get(`/explorateurs/${target.name}/units/${(Entities.validUnitKeys.get(other.name) || [''])[0]}`)
              .set('Authorization', authorization)
              .set('Accept', 'text/plain')
              .expect(404, done);
          });
        });

        describe('with an invalid unit', () => {
          it('should not find unit', done => {
            app.get(`/explorateurs/${target.name}/units/${Entities.invalidUnitKey}`)
              .set('Authorization', authorization)
              .set('Accept', 'application/json')
              .expect(404, done);
          });

          it('should not find unit', done => {
            app.get(`/explorateurs/${target.name}/units/${Entities.invalidUnitKey}`)
              .set('Authorization', authorization)
              .set('Accept', 'text/plain')
              .expect(404, done);
          });
        });
      });

      describe('with invalid explorateur', () => {
        describe('with a valid unit', () => {
          it('should not find user', done => {
            app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/units/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
              .set('Authorization', authorization)
              .set('Accept', 'application/json')
              .expect(404, done);
          });

          it('should not find user', done => {
            app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/units/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
              .set('Authorization', authorization)
              .set('Accept', 'text/plain')
              .expect(404, done);
          });
        });

        describe('with an invalid unit', () => {
          it('should not find user', done => {
            app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/units/${Entities.invalidUnitKey}`)
              .set('Authorization', authorization)
              .set('Accept', 'application/json')
              .expect(404, done);
          });

          it('should not find user', done => {
            app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/units/${Entities.invalidUnitKey}`)
              .set('Authorization', authorization)
              .set('Accept', 'text/plain')
              .expect(404, done);
          });
        });
      });
    });

    describe('with anonymous user', () => {
      describe('with valid explorateur', () => {
        describe('with valid unit', () => {
          it('should refuse access', done => {
            app.get(`/explorateurs/${target.name}/units/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
              .set('Accept', 'application/json')
              .expect(401, done);
          });

          it('should refuse access', done => {
            app.get(`/explorateurs/${target.name}/units/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
              .set('Accept', 'text/plain')
              .expect(401, done);
          });
        });

        describe("with another explorateur's unit", () => {
          it('should refuse access', done => {
            app.get(`/explorateurs/${target.name}/units/${(Entities.validUnitKeys.get(other.name) || [''])[0]}`)
              .set('Accept', 'application/json')
              .expect(401, done);
          });

          it('should refuse access', done => {
            app.get(`/explorateurs/${target.name}/units/${(Entities.validUnitKeys.get(other.name) || [''])[0]}`)
              .set('Accept', 'text/plain')
              .expect(401, done);
          });
        });

        describe('with an invalid unit', () => {
          it('should refuse access', done => {
            app.get(`/explorateurs/${target.name}/units/${Entities.invalidUnitKey}`)
              .set('Accept', 'application/json')
              .expect(401, done);
          });

          it('should refuse access', done => {
            app.get(`/explorateurs/${target.name}/units/${Entities.invalidUnitKey}`)
              .set('Accept', 'text/plain')
              .expect(401, done);
          });
        });
      });

      describe('with invalid explorateur', () => {
        describe('with a valid unit', () => {
          it('should refuse access', done => {
            app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/units/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
              .set('Accept', 'application/json')
              .expect(401, done);
          });

          it('should refuse access', done => {
            app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/units/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
              .set('Accept', 'text/plain')
              .expect(401, done);
          });
        });

        describe('with an invalid unit', () => {
          it('should refuse access', done => {
            app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/units/${Entities.invalidUnitKey}`)
              .set('Accept', 'application/json')
              .expect(401, done);
          });

          it('should refuse access', done => {
            app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/units/${Entities.invalidUnitKey}`)
              .set('Accept', 'text/plain')
              .expect(401, done);
          });
        });
      });
    });
  });
});
