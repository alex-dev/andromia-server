import { ExpressApplication } from '@tsed/common';
import { bootstrap, inject } from '@tsed/testing';
import { describe, beforeEach, it } from 'mocha';
import { Server } from '../src/server';
import { authenticate } from './authenticator/authenticator';
import { validateOwnedUnit, validateOwnedUnits } from './validators/models';
import * as request from 'supertest';

describe("Explorateur's units:", () => {
  let app: request.SuperTest<request.Test>;
  let authorization: any;

  beforeEach(bootstrap(Server));
  beforeEach(inject([ExpressApplication], (express: ExpressApplication) => {
    app = request(express);
  }));

  describe('GET /explorateurs/{name}/units', () => {
    const user = { name: 'user', password: 'valid' };

    describe('with explorateur being connected user', () => {
      beforeEach(() => {
        authorization = authenticate(user, app);
      });

      it('should return all units owned by explorateur', done => {
        app.get(`/explorateurs/${user.name}/units`)
          .set('Authorization', authorization)
          .expect('Content-Type', 'application/json')
          .expect(200)
          .end((error, response) => {
            if (error) {
              done(error);
            }

            validateOwnedUnits(JSON.parse(response.text));
            done();
          })
      });
    })
  });
});
