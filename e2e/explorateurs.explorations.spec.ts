import { ExpressApplication } from '@tsed/common';
import { bootstrap, inject } from '@tsed/testing';
import { describe, beforeEach, it } from 'mocha';
import { Server } from '../src/server';
import { authenticate } from './authenticator/authenticator';
import { Entities } from './database/entities';
import { validateCollection } from './validators/halson';
import { validateExplorateur, validateExploration, validateExplorations } from './validators/models';
import * as moment from 'moment';
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

      describe('with valid explorateur', () => {
        it('should return all explorations done by explorateur', done => {
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

      describe('with invalid explorateur', () => {
        it('should not find user', done => {
          app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
            .set('Authorization', authorization)
            .set('Accept', 'application/hal+json')
            .expect(404, done);
        });

        it('should not find user', done => {
          app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
            .set('Authorization', authorization)
            .set('Accept', 'text/html')
            .expect(404, done);
        });
      });
    });

    describe('with anonymous user', () => {
      describe('with valid explorateur', () => {
        it('should refuse access', done => {
          app.get(`/explorateurs/${target.name}/explorations`)
            .set('Accept', 'application/hal+json')
            .expect(401, done);
        });

        it('should refuse access', done => {
          app.get(`/explorateurs/${target.name}/explorations`)
            .set('Accept', 'text/html')
            .expect(401, done);
        });
      });

      describe('with invalid explorateur', () => {
        it('should refuse access', done => {
          app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
            .set('Accept', 'application/hal+json')
            .expect(401, done);
        });

        it('should refuse access', done => {
          app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
            .set('Accept', 'text/html')
            .expect(401, done);
        });
      });
    });
  });

  describe('POST /explorateurs/{name}/explorations', () => {
    describe('with authenticated user being target explorateur', () => {
      beforeEach(() => {
        authorization = authenticate(target, app);
      });

      describe('with valid exploration', () => {
        it('should create exploration and return explorateur', done => {
          app.post(`/explorateurs/${target.name}/explorations`)
            .set('Authorization', authorization)
            .set('Accept', 'application/json')
            .send({
              started: moment.utc(),
              ended: moment.utc(),
              runes: {
                air: 2,
                darkness: 3
              },
              to: "Inoxis"
            })
            .expect(201)
            .expect('Location', /.*/)
            .expect((response: request.Response) => validateExplorateur(JSON.parse(response.text), false, false))
            .expect((response: request.Response) => {
              app.get(response.get('Location'))
                .expect(200)
                .expect('Content-Type', 'application/json')
                .expect((response: request.Response) => validateExploration(JSON.parse(response.text)), () => { });
            }, done);
        });

        it('should create exploration and return explorateur with expanded units', done => {
          app.post(`/explorateurs/${target.name}/explorations?expend=units`)
            .set('Authorization', authorization)
            .set('Accept', 'application/json')
            .send({
              started: moment.utc(),
              ended: moment.utc(),
              runes: {
                air: 2,
                darkness: 3
              },
              to: "Inoxis"
            })
            .expect(201)
            .expect('Location', /.*/)
            .expect((response: request.Response) => validateExplorateur(JSON.parse(response.text), true, false), done)
            .expect((response: request.Response) => {
              app.get(response.get('Location'))
                .expect(200)
                .expect('Content-Type', 'application/json')
                .expect((response: request.Response) => validateExploration(JSON.parse(response.text)), () => { });
            }, done);
        });

        it('should create exploration and return explorateur with expanded explorations', done => {
          app.post(`/explorateurs/${target.name}/explorations?expend=explorations`)
            .set('Authorization', authorization)
            .set('Accept', 'application/json')
            .send({
              started: moment.utc(),
              ended: moment.utc(),
              runes: {
                air: 2,
                darkness: 3
              },
              to: "Inoxis"
            })
            .expect(201)
            .expect('Location', /.*/)
            .expect((response: request.Response) => validateExplorateur(JSON.parse(response.text), false, true), done)
            .expect((response: request.Response) => {
              app.get(response.get('Location'))
                .expect(200)
                .expect('Content-Type', 'application/json')
                .expect((response: request.Response) => validateExploration(JSON.parse(response.text)), () => { });
            }, done);
        });

        it('should create exploration and return explorateur with expanded explorations and units', done => {
          app.post(`/explorateurs/${target.name}/explorations?expend=explorations,units`)
            .set('Authorization', authorization)
            .set('Accept', 'application/json')
            .send({
              started: moment.utc(),
              ended: moment.utc(),
              runes: {
                air: 2,
                darkness: 3
              },
              to: "Inoxis"
            })
            .expect(201)
            .expect('Location', /.*/)
            .expect((response: request.Response) => validateExplorateur(JSON.parse(response.text), true, true), done)
            .expect((response: request.Response) => {
              app.get(response.get('Location'))
                .expect(200)
                .expect('Content-Type', 'application/json')
                .expect((response: request.Response) => validateExploration(JSON.parse(response.text)), () => { });
            }, done);
        });

        it('should return not acceptable', done => {
          app.post(`/explorateurs/${target.name}/explorations`)
            .set('Authorization', authorization)
            .set('Accept', 'text/html')
            .set('Content-Type', 'application/json')
            .send({
              started: moment.utc(),
              ended: moment.utc(),
              runes: {
                air: 2,
                darkness: 3
              },
              to: "Inoxis"
            })
            .expect(406, done);
        });
      });

      describe('with unprocessable body', () => {
        it('should inform', done => {
          app.post(`/explorateurs/${target.name}/explorations`)
            .set('Authorization', authorization)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ invalid: true })
            .expect(422, done);
        });

        it('should inform', done => {
          app.post(`/explorateurs/${target.name}/explorations`)
            .set('Authorization', authorization)
            .set('Accept', 'text/html')
            .set('Content-Type', 'application/json')
            .send({ invalid: true })
            .expect(422, done);
        });
      });

      describe('with invalid content type', () => {
        it('should inform', done => {
          app.post(`/explorateurs/${target.name}/explorations`)
            .set('Authorization', authorization)
            .set('Accept', 'application/json')
            .set('Content-Type', 'text/html')
            .send({
              started: moment.utc(),
              ended: moment.utc(),
              runes: {
                air: 2,
                darkness: 3
              },
              to: "Inoxis"
            })
            .expect(415, done);
        });
  
        it('should inform', done => {
          app.post(`/explorateurs/${target.name}/explorations`)
            .set('Authorization', authorization)
            .set('Accept', 'text/html')
            .set('Content-Type', 'text/html')
            .send({
              started: moment.utc(),
              ended: moment.utc(),
              runes: {
                air: 2,
                darkness: 3
              },
              to: "Inoxis"
            })
            .expect(415, done);
        });
      });
    });

    describe('with authenticated user not being target explorateur', () => {
      beforeEach(() => {
        authorization = authenticate(other, app);
      });

      describe('with valid explorateur', () => {
        describe('with valid exploration', () => {
          it('should return forbidden', done => {
            app.post(`/explorateurs/${target.name}/explorations`)
              .set('Authorization', authorization)
              .set('Accept', 'application/json')
              .send({})
              .expect(403, done);
          });
  
          it('should return forbidden', done => {
            app.post(`/explorateurs/${target.name}/explorations`)
              .set('Authorization', authorization)
              .set('Accept', 'text/html')
              .set('Content-Type', 'application/json')
              .send({})
              .expect(403, done);
          });
        });
  
        describe('with unprocessable body', () => {
          it('should return forbidden', done => {
            app.post(`/explorateurs/${target.name}/explorations`)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/json')
              .send({ invalid: true })
              .expect(403, done);
          });
  
          it('should return forbidden', done => {
            app.post(`/explorateurs/${target.name}/explorations`)
              .set('Accept', 'text/html')
              .set('Content-Type', 'application/json')
              .send({ invalid: true })
              .expect(403, done);
          });
        });
  
        describe('with invalid content type', () => {
          it('should return forbidden', done => {
            app.post(`/explorateurs/${target.name}/explorations`)
              .set('Accept', 'application/json')
              .set('Content-Type', 'text/html')
              .send({})
              .expect(403, done);
          });
    
          it('should return forbidden', done => {
            app.post(`/explorateurs/${target.name}/explorations`)
              .set('Accept', 'text/html')
              .set('Content-Type', 'text/html')
              .send({})
              .expect(403, done);
          });
        });
      });

      describe('with invalid explorateur', () => {
        describe('with valid exploration', () => {
          it('should return forbidden', done => {
            app.post(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
              .set('Authorization', authorization)
              .set('Accept', 'application/json')
              .send({
                started: moment.utc(),
                ended: moment.utc(),
                runes: {
                  air: 2,
                  darkness: 3
                },
                to: "Inoxis"
              })
              .expect(403, done);
          });
  
          it('should return forbidden', done => {
            app.post(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
              .set('Authorization', authorization)
              .set('Accept', 'text/html')
              .set('Content-Type', 'application/json')
              .send({
                started: moment.utc(),
                ended: moment.utc(),
                runes: {
                  air: 2,
                  darkness: 3
                },
                to: "Inoxis"
              })
              .expect(403, done);
          });
        });
  
        describe('with unprocessable body', () => {
          it('should return forbidden', done => {
            app.post(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
              .set('Authorization', authorization)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/json')
              .send({ invalid: true })
              .expect(403, done);
          });
  
          it('should return forbidden', done => {
            app.post(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
              .set('Authorization', authorization)
              .set('Accept', 'text/html')
              .set('Content-Type', 'application/json')
              .send({ invalid: true })
              .expect(403, done);
          });
        });
  
        describe('with invalid content type', () => {
          it('should return forbidden', done => {
            app.post(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
              .set('Authorization', authorization)
              .set('Accept', 'application/json')
              .set('Content-Type', 'text/html')
              .send({
                started: moment.utc(),
                ended: moment.utc(),
                runes: {
                  air: 2,
                  darkness: 3
                },
                to: "Inoxis"
              })
              .expect(403, done);
          });
    
          it('should return forbidden', done => {
            app.post(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
              .set('Authorization', authorization)
              .set('Accept', 'text/html')
              .set('Content-Type', 'text/html')
              .send({
                started: moment.utc(),
                ended: moment.utc(),
                runes: {
                  air: 2,
                  darkness: 3
                },
                to: "Inoxis"
              })
              .expect(403, done);
          });
        });
      });
    });

    describe('with anonymous user', () => {
      describe('with valid explorateur', () => {
        describe('with valid exploration', () => {
          it('should refuse access', done => {
            app.post(`/explorateurs/${target.name}/explorations`)
              .set('Accept', 'application/json')
              .send({
                started: moment.utc(),
                ended: moment.utc(),
                runes: {
                  air: 2,
                  darkness: 3
                },
                to: "Inoxis"
              })
              .expect(401, done);
          });
  
          it('should refuse access', done => {
            app.post(`/explorateurs/${target.name}/explorations`)
              .set('Accept', 'text/html')
              .set('Content-Type', 'application/json')
              .send({
                started: moment.utc(),
                ended: moment.utc(),
                runes: {
                  air: 2,
                  darkness: 3
                },
                to: "Inoxis"
              })
              .expect(401, done);
          });
        });
  
        describe('with unprocessable body', () => {
          it('should refuse access', done => {
            app.post(`/explorateurs/${target.name}/explorations`)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/json')
              .send({ invalid: true })
              .expect(401, done);
          });
  
          it('should refuse access', done => {
            app.post(`/explorateurs/${target.name}/explorations`)
              .set('Accept', 'text/html')
              .set('Content-Type', 'application/json')
              .send({ invalid: true })
              .expect(401, done);
          });
        });
  
        describe('with invalid content type', () => {
          it('should refuse access', done => {
            app.post(`/explorateurs/${target.name}/explorations`)
              .set('Accept', 'application/json')
              .set('Content-Type', 'text/html')
              .send({
                started: moment.utc(),
                ended: moment.utc(),
                runes: {
                  air: 2,
                  darkness: 3
                },
                to: "Inoxis"
              })
              .expect(401, done);
          });
    
          it('should refuse access', done => {
            app.post(`/explorateurs/${target.name}/explorations`)
              .set('Accept', 'text/html')
              .set('Content-Type', 'text/html')
              .send({
                started: moment.utc(),
                ended: moment.utc(),
                runes: {
                  air: 2,
                  darkness: 3
                },
                to: "Inoxis"
              })
              .expect(401, done);
          });
        });
      });

      describe('with invalid explorateur', () => {
        describe('with valid exploration', () => {
          it('should refuse access', done => {
            app.post(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
              .set('Accept', 'application/json')
              .send({
                started: moment.utc(),
                ended: moment.utc(),
                runes: {
                  air: 2,
                  darkness: 3
                },
                to: "Inoxis"
              })
              .expect(401, done);
          });
  
          it('should refuse access', done => {
            app.post(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
              .set('Accept', 'text/html')
              .set('Content-Type', 'application/json')
              .send({
                started: moment.utc(),
                ended: moment.utc(),
                runes: {
                  air: 2,
                  darkness: 3
                },
                to: "Inoxis"
              })
              .expect(401, done);
          });
        });
  
        describe('with unprocessable body', () => {
          it('should refuse access', done => {
            app.post(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/json')
              .send({ invalid: true })
              .expect(401, done);
          });
  
          it('should refuse access', done => {
            app.post(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
              .set('Accept', 'text/html')
              .set('Content-Type', 'application/json')
              .send({ invalid: true })
              .expect(401, done);
          });
        });
  
        describe('with invalid content type', () => {
          it('should refuse access', done => {
            app.post(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
              .set('Accept', 'application/json')
              .set('Content-Type', 'text/html')
              .send({
                started: moment.utc(),
                ended: moment.utc(),
                runes: {
                  air: 2,
                  darkness: 3
                },
                to: "Inoxis"
              })
              .expect(401, done);
          });
    
          it('should refuse access', done => {
            app.post(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
              .set('Accept', 'text/html')
              .set('Content-Type', 'text/html')
              .send({
                started: moment.utc(),
                ended: moment.utc(),
                runes: {
                  air: 2,
                  darkness: 3
                },
                to: "Inoxis"
              })
              .expect(401, done);
          });
        });
      });
    });
  });

  describe('GET /explorateurs/{name}/explorations/{uuid}', () => {
    describe('with authenticated user being target explorateur', () => {
      beforeEach(() => {
        authorization = authenticate(target, app);
      });

      describe('with valid exploration', () => {
        it('should return requested exploration', done => {
          app.get(`/explorateurs/${target.name}/explorations/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
            .set('Authorization', authorization)
            .expect('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .expect((response: request.Response) => validateExploration(JSON.parse(response.text)), done);
        });

        it('should return not acceptable', done => {
          app.get(`/explorateurs/${target.name}/explorations/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
            .set('Authorization', authorization)
            .set('Accept', 'text/html')
            .expect(406, done);
        });
      });

      describe("with another explorateur's exploration", () => {
        it('should not find exploration', done => {
          app.get(`/explorateurs/${target.name}/explorations/${(Entities.validUnitKeys.get(other.name) || [''])[0]}`)
            .set('Authorization', authorization)
            .set('Accept', 'application/json')
            .expect(404, done);
        });

        it('should not find exploration', done => {
          app.get(`/explorateurs/${target.name}/explorations/${(Entities.validUnitKeys.get(other.name) || [''])[0]}`)
            .set('Authorization', authorization)
            .set('Accept', 'text/html')
            .expect(404, done);
        });
      });

      describe('with an invalid exploration', () => {
        it('should not find exploration', done => {
          app.get(`/explorateurs/${target.name}/explorations/${Entities.invalidUnitKey}`)
            .set('Authorization', authorization)
            .set('Accept', 'application/json')
            .expect(404, done);
        });

        it('should not find exploration', done => {
          app.get(`/explorateurs/${target.name}/explorations/${Entities.invalidUnitKey}`)
            .set('Authorization', authorization)
            .set('Accept', 'text/html')
            .expect(404, done);
        });
      });
    });

    describe('with authenticated user not being target explorateur', () => {
      beforeEach(() => {
        authorization = authenticate(Entities.validAuthentication[1], app);
      });

      describe('with valid explorateur', () => {
        describe('with valid exploration', () => {
          it('should return requested exploration', done => {
            app.get(`/explorateurs/${target.name}/explorations/${Entities.validUnitKeys.get(target.name)}`)
              .set('Authorization', authorization)
              .expect('Content-Type', 'application/json')
              .set('Accept', 'application/json')
              .expect(200)
              .expect((response: request.Response) => validateExploration(JSON.parse(response.text)), done);
          });

          it('should return not acceptable', done => {
            app.get(`/explorateurs/${target.name}/explorations/${Entities.validUnitKeys.get(target.name)}`)
              .set('Authorization', authorization)
              .set('Accept', 'text/html')
              .expect(406, done);
          });
        });
  
        describe("with another explorateur's exploration", () => {
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
        });

        describe('with an invalid exploration', () => {
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
      });

      describe('with invalid explorateur', () => {
        describe('with a valid exploration', () => {
          it('should not find user', done => {
            app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
              .set('Authorization', authorization)
              .set('Accept', 'application/json')
              .expect(404, done);
          });
          
          it('should not find user', done => {
            app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
              .set('Authorization', authorization)
              .set('Accept', 'text/html')
              .expect(404, done);
          });
        });

        describe('with an invalid exploration', () => {
          it('should not find user', done => {
            app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations/${Entities.invalidUnitKey}`)
              .set('Authorization', authorization)
              .set('Accept', 'application/json')
              .expect(404, done);
          });

          it('should not find user', done => {
            app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations/${Entities.invalidUnitKey}`)
              .set('Authorization', authorization)
              .set('Accept', 'text/html')
              .expect(404, done);
          });
        });
      });
    });

    describe('with anonymous user', () => {
      describe('with valid explorateur', () => {
        describe('with valid exploration', () => {
          it('should refuse access', done => {
            app.get(`/explorateurs/${target.name}/explorations/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
              .set('Accept', 'application/json')
              .expect(401, done);
          });

          it('should refuse access', done => {
            app.get(`/explorateurs/${target.name}/explorations/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
              .set('Accept', 'text/html')
              .expect(401, done);
          });
        });

        describe("with another explorateur's exploration", () => {
          it('should refuse access', done => {
            app.get(`/explorateurs/${target.name}/explorations/${(Entities.validUnitKeys.get(other.name) || [''])[0]}`)
              .set('Accept', 'application/json')
              .expect(401, done);
          });

          it('should refuse access', done => {
            app.get(`/explorateurs/${target.name}/explorations/${(Entities.validUnitKeys.get(other.name) || [''])[0]}`)
              .set('Accept', 'text/html')
              .expect(401, done);
          });
        });

        describe('with an invalid exploration', () => {
          it('should refuse access', done => {
            app.get(`/explorateurs/${target.name}/explorations/${Entities.invalidUnitKey}`)
              .set('Accept', 'application/json')
              .expect(401, done);
          });

          it('should refuse access', done => {
            app.get(`/explorateurs/${target.name}/explorations/${Entities.invalidUnitKey}`)
              .set('Accept', 'text/html')
              .expect(401, done);
          });
        });
      });

      describe('with invalid explorateur', () => {
        describe('with a valid exploration', () => {
          it('should refuse access', done => {
            app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
              .set('Accept', 'application/json')
              .expect(401, done);
          });

          it('should refuse access', done => {
            app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations/${(Entities.validUnitKeys.get(target.name) || [''])[0]}`)
              .set('Accept', 'text/html')
              .expect(401, done);
          });
        });

        describe('with an invalid exploration', () => {
          it('should refuse access', done => {
            app.get(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations/${Entities.invalidUnitKey}`)
              .set('Accept', 'application/json')
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
  });
});
