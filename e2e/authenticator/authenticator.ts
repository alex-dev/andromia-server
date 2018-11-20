import { Done } from 'mocha';
import * as request from 'supertest';

export function authenticate(
  data: { name: string, password: string},
  server: request.SuperTest<request.Test>, done?: Done): any {
  let header: any;

  server.post('/login').send(data)
    .expect(200)
    .end((error, response) => {
      if (error && done) {
        done(error);
      }

      header = response.get('Authorization');
      
      if (done) {
        done();
      }
    });

  return header;
}