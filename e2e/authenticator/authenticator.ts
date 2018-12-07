import { Done } from 'mocha';
import * as request from 'supertest';

export function authenticate(
  data: { name: string, password: string},
  server: request.SuperTest<request.Test>,
  setter: (header: any) => void,
  done: Done): any {

  server.post('/login').send(data)
    .expect(200)
    .expect('X-Token', /.*/)
    .end((error, response) => {
      if (error) {
        done(error);
      }

      setter(response.get('X-Token'));
      done();
    });
}