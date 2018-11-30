import { ExpressApplication } from '@tsed/common';
import { bootstrap, inject } from '@tsed/testing';
import { describe, beforeEach, it } from 'mocha';
import { Server } from '../src/server';
import { authenticate } from './authenticator/authenticator';
import { Entities } from './database/entities';
import { validateCollection } from './validators/halson';
import { validateExplorateur, validateExplorateurs, validateUnit, validateExploration } from './validators/models';
import * as request from 'supertest';

describe("Explorateur:", () => {
  const target = Entities.validAuthentication[0];
  const other = Entities.validAuthentication[1];

  let app: request.SuperTest<request.Test>;
  let authorization: any;

  beforeEach(bootstrap(Server));
  beforeEach(inject([ExpressApplication], (express: ExpressApplication) => {
    app = request(express);
  }));

  describe('GET /explorateurs', () => {
    beforeEach(() => {
      authorization = authenticate(target, app);
    });
    
    it('should return all known explorateurs', done => {
      app.get('/explorateurs')
        .set('Accept', 'application/hal+json')
        .expect('Content-Type', 'application/hal+json')
        .expect(200)
        .expect(response => validateCollection(JSON.parse(response.text)))
        .expect((response: request.Response) => validateExplorateurs(JSON.parse(response.text).items), done);
    });

    it('should return not acceptable', done => {
      app.get('/explorateurs')
        .set('Accept', 'text/html')
        .expect(406, done);
    });
  });

  describe('POST /explorateurs', () => {
    beforeEach(() => {
      authorization = authenticate(target, app);
    });

    describe('with valid explorateur', () => {
      it('should create explorateur and return explorateur', done => {
        app.post(`/explorateurs`)
          .set('Authorization', authorization)
          .set('Accept', 'application/json')
          .send({})
          .expect(201)
          .expect('Explorateur', /.*/)
          .expect((response: request.Response) => validateExplorateur(JSON.parse(response.text), false, false), done)
      });

      it('should create explorateur and return explorateur with expanded units', done => {
        app.post(`/explorateurs?expand=units`)
          .set('Authorization', authorization)
          .set('Accept', 'application/json')
          .send({})
          .expect(201)
          .expect('Explorateur', /.*/)
          .expect((response: request.Response) => validateExplorateur(JSON.parse(response.text), true, false), done)
          .expect((response: request.Response) => {
            app.get(response.get('Unit'))
              .expect(200)
              .expect('Content-Type', 'application/json')
              .expect((response: request.Response) => validateUnit(JSON.parse(response.text)), () => { });
          }, done);
      });

      it('should create explorateur and return explorateur with expanded explorations', done => {
        app.post(`/explorateurs?expand=explorations`)
          .set('Authorization', authorization)
          .set('Accept', 'application/json')
          .send({})
          .expect(201)
          .expect('Explorateur', /.*/)
          .expect((response: request.Response) => validateExplorateur(JSON.parse(response.text), false, true), done)
          .expect((response: request.Response) => {
            app.get(response.get('Location'))
              .expect(201)
              .expect('Content-Type', 'application/json')
              .expect((response: request.Response) => validateExploration(JSON.parse(response.text)), () => { });
          }, done);
      });

      it('should create explorateur and return explorateur with expanded units and explorations', done => {
        app.post(`/explorateurs?expand=units,explorations`)
          .set('Authorization', authorization)
          .set('Accept', 'application/json')
          .send({})
          .expect(201)
          .expect('Explorateur', /.*/)
          .expect((response: request.Response) => validateExplorateur(JSON.parse(response.text), false, true), done)
          .expect((response: request.Response) => {
            app.get(response.get('Unit'))
              .expect(201)
              .expect('Content-Type', 'application/json')
              .expect((response: request.Response) => validateUnit(JSON.parse(response.text)), () => { });
          }, done)
          .expect((response: request.Response) => {
            app.get(response.get('Location'))
              .expect(201)
              .expect('Content-Type', 'application/json')
              .expect((response: request.Response) => validateExploration(JSON.parse(response.text)), () => { });
          }, done);
      });

      it('should return not acceptable', done => {
        app.post(`/explorateurs`)
          .set('Authorization', authorization)
          .set('Accept', 'text/html')
          .set('Content-Type', 'application/json')
          .send({})
          .expect(406, done);
      });
    });
    
    describe('with unprocessable body', () => {
      it('should inform', done => {
        app.post(`/explorateurs`)
          .set('Authorization', authorization)
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .send({ invalid: true })
          .expect(422, done);
      });

      it('should inform', done => {
        app.post(`/explorateurs`)
          .set('Authorization', authorization)
          .set('Accept', 'text/html')
          .set('Content-Type', 'application/json')
          .send({ invalid: true })
          .expect(422, done);
      });
    });

    describe('with unprocessable body', () => {
      it('should inform', done => {
        app.post(`/explorateurs`)
          .set('Authorization', authorization)
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .send({ invalid: true })
          .expect(415, done);
      });

      it('should inform', done => {
        app.post(`/explorateurs`)
          .set('Authorization', authorization)
          .set('Accept', 'text/html')
          .set('Content-Type', 'application/json')
          .send({ invalid: true })
          .expect(415, done);
      });
    });
  });

  describe('GET /explorateurs/{name}', () => {
    describe('with valid explorateur', () => {
      it('should return a known explorateur by its name', done => {
        app.get(`/explorateurs/${Entities.validAuthentication[0]}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', 'application/json')
          .expect(200)
          .expect((response: request.Response) => validateExplorateur(JSON.parse(response.text)), done);
      });

      it('should return not acceptable', done => {
        app.get(`/explorateurs/${Entities.validAuthentication[0]}`)
          .set('Accept', 'text/html')
          .expect(406, done);
      });
    });

    describe('with an invalid explorateur', () => {
      it('should not find explorateur', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication}`)
          .set('Accept', 'application/json')
          .expect(404, done);
      });

      it('should not find explorateur', done => {
        app.get(`/explorateurs/${Entities.invalidAuthentication}`)
          .set('Accept', 'text/html')
          .expect(404, done);
      });
    });
  });

  describe('PUT /explorateurs/{name}', () => {
    let authorization: any;

    describe('with authenticated user being target explorateur', () => {
      beforeEach(() => {
        authorization = authenticate(target, app);
      });

      describe('with valid exploration', () => {
        it('should update explorateur and return the updated explorateur', done => {
          app.put(`/explorateurs/${target.name}`)
          .set('Authorization', authorization)
            .set('Accept', 'application/json')
            .send({})
            .expect(200)
            .expect('Explorateur', /.*/)
            .expect((response: request.Response) => validateExplorateur(JSON.parse(response.text), false, false), done);
        });
  
        it('should update explorateur and return the updated explorateur with expanded units', done => {
          app.put(`/explorateurs/${target.name}?expand=units`)
            .set('Authorization', authorization)
            .set('Accept', 'application/json')
            .send({})
            .expect(200)
            .expect('Explorateur', /.*/)
            .expect((response: request.Response) => validateExplorateur(JSON.parse(response.text), true, false), done);
        });
        
        it('should update explorateur and return the updated explorateur with expanded explorations', done => {
          app.put(`/explorateurs/${target.name}?expand=explorations`)
            .set('Authorization', authorization)
            .set('Accept', 'application/json')
            .send({})
            .expect(200)
            .expect('Explorateur', /.*/)
            .expect((response: request.Response) => validateExplorateur(JSON.parse(response.text), false, true), done);
        });
  
        it('should update explorateur and return the updated explorateur with expanded units and explorations', done => {
          app.put(`/explorateurs/${target.name}?expand=units,explorations`)
            .set('Authorization', authorization)
            .set('Accept', 'application/json')
            .send({})
            .expect(200)
            .expect('Explorateur', /.*/)
            .expect((response: request.Response) => validateExplorateur(JSON.parse(response.text), true, true), done);
        });

        it('should return not acceptable', done => {
          app.put(`/explorateurs/${target.name}`)
            .set('Authorization', authorization)
            .set('Accept', 'text/html')
            .set('Content-Type', 'application/json')
            .send({})
            .expect(406, done);
        });
      });

      describe('with unprocessable body', () => {
        it('should inform', done => {
          app.put(`/explorateurs/${target.name}`)
            .set('Authorization', authorization)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ invalid: true })
            .expect(422, done);
        });

        it('should inform', done => {
          app.put(`/explorateurs/${target.name}`)
            .set('Authorization', authorization)
            .set('Accept', 'text/html')
            .set('Content-Type', 'application/json')
            .send({ invalid: true })
            .expect(422, done);
        });
      });

      describe('with invalid content type', () => {
        it('should inform', done => {
          app.post(`/explorateurs/${target.name}`)
            .set('Authorization', authorization)
            .set('Accept', 'application/json')
            .set('Content-Type', 'text/html')
            .send({})
            .expect(415, done);
        });
  
        it('should inform', done => {
          app.post(`/explorateurs/${target.name}`)
            .set('Authorization', authorization)
            .set('Accept', 'text/html')
            .set('Content-Type', 'text/html')
            .send({})
            .expect(415, done);
        });
      });

      describe('with an invalid explorateur', () => {
        it('should not find explorateur', done => {
          app.put(`/explorateurs/${target.name}`)
            .set('Accept', 'application/json')
            .expect(404, done);
        });
  
        it('should not find explorateur', done => {
          app.put(`/explorateurs/${target.name}`)
            .set('Accept', 'text/html')
            .expect(404, done);
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
            app.post(`/explorateurs/${target.name}`)
              .set('Authorization', authorization)
              .set('Accept', 'application/json')
              .send({})
              .expect(403, done);
          });
  
          it('should return forbidden', done => {
            app.post(`/explorateurs/${target.name}`)
              .set('Authorization', authorization)
              .set('Accept', 'text/html')
              .set('Content-Type', 'application/json')
              .send({})
              .expect(403, done);
          });
        });
  
        describe('with unprocessable body', () => {
          it('should return forbidden', done => {
            app.post(`/explorateurs/${target.name}`)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/json')
              .send({ invalid: true })
              .expect(422, done);
          });
  
          it('should return forbidden', done => {
            app.post(`/explorateurs/${target.name}`)
              .set('Accept', 'text/html')
              .set('Content-Type', 'application/json')
              .send({ invalid: true })
              .expect(422, done);
          });
        });
  
        describe('with invalid content type', () => {
          it('should return forbidden', done => {
            app.post(`/explorateurs/${target.name}`)
              .set('Accept', 'application/json')
              .set('Content-Type', 'text/html')
              .send({})
              .expect(415, done);
          });
    
          it('should return forbidden', done => {
            app.post(`/explorateurs/${target.name}`)
              .set('Accept', 'text/html')
              .set('Content-Type', 'text/html')
              .send({})
              .expect(415, done);
          });
        });
      });

      describe('with invalid explorateur', () => {
        describe('with valid exploration', () => {
          it('should return forbidden', done => {
            app.post(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
              .set('Authorization', authorization)
              .set('Accept', 'application/json')
              .send({})
              .expect(403, done);
          });
  
          it('should return forbidden', done => {
            app.post(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
              .set('Authorization', authorization)
              .set('Accept', 'text/html')
              .set('Content-Type', 'application/json')
              .send({})
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
              .send({})
              .expect(403, done);
          });
    
          it('should return forbidden', done => {
            app.post(`/explorateurs/${Entities.invalidAuthentication[0].name}/explorations`)
              .set('Authorization', authorization)
              .set('Accept', 'text/html')
              .set('Content-Type', 'text/html')
              .send({})
              .expect(403, done);
          });
        });
      });
    });

    describe('with anonymous user', () => {
      describe('with valid explorateur', () => {
        it('should refuse access', done => {
          app.post(`/explorateurs/${target.name}`)
            .set('Accept', 'application/json')
            .send({})
            .expect(401, done);
        });
  
        it('should refuse access', done => {
          app.post(`/explorateurs/${target.name}`)
            .set('Accept', 'text/html')
            .set('Content-Type', 'application/json')
            .send({})
            .expect(401, done);
        });
  
        describe('with unprocessable body', () => {
          it('should refuse access', done => {
            app.post(`/explorateurs/${target.name}`)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/json')
              .send({ invalid: true })
              .expect(401, done);
          });
  
          it('should refuse access', done => {
            app.post(`/explorateurs/${target.name}`)
              .set('Accept', 'text/html')
              .set('Content-Type', 'application/json')
              .send({ invalid: true })
              .expect(401, done);
          });
        });
  
        describe('with invalid content type', () => {
          it('should refuse access', done => {
            app.post(`/explorateurs/${target.name}`)
              .set('Accept', 'application/json')
              .set('Content-Type', 'text/html')
              .send({})
              .expect(401, done);
          });
    
          it('should refuse access', done => {
            app.post(`/explorateurs/${target.name}`)
              .set('Accept', 'text/html')
              .set('Content-Type', 'text/html')
              .send({})
              .expect(401, done);
          });
        });
      });

      describe('with invalid explorateur', () => {
        it('should refuse access', done => {
          app.post(`/explorateurs/${target.name}`)
            .set('Accept', 'application/json')
            .send({})
            .expect(401, done);
        });
  
        it('should refuse access', done => {
          app.post(`/explorateurs/${target.name}`)
            .set('Accept', 'text/html')
            .set('Content-Type', 'application/json')
            .send({})
            .expect(401, done);
        });
  
        describe('with unprocessable body', () => {
          it('should refuse access', done => {
            app.post(`/explorateurs/${target.name}`)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/json')
              .send({ invalid: true })
              .expect(401, done);
          });
  
          it('should refuse access', done => {
            app.post(`/explorateurs/${target.name}`)
              .set('Accept', 'text/html')
              .set('Content-Type', 'application/json')
              .send({ invalid: true })
              .expect(401, done);
          });
        });
  
        describe('with invalid content type', () => {
          it('should refuse access', done => {
            app.post(`/explorateurs/$${target.name}`)
              .set('Accept', 'application/json')
              .set('Content-Type', 'text/html')
              .send({})
              .expect(401, done);
          });
    
          it('should refuse access', done => {
            app.post(`/explorateurs/${target.name}`)
              .set('Accept', 'text/html')
              .set('Content-Type', 'text/html')
              .send({})
              .expect(401, done);
          });
        });
      });
    });
  });
});
