import { ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware } from '@tsed/common';
import '@tsed/mongoose';
import * as parser from 'body-parser';
import * as compress from 'compression';
import * as override from 'method-override';
import * as Path from 'path';

@ServerSettings({
  debug: process.env.NODE_ENV != 'prod',
  port: process.env.PORT,
  rootDir: Path.resolve(__dirname),
  acceptMimes: ['application/json'],
  mount: {
    '/': '${rootDir}/controllers/**/*.controller.?s'
  },
  componentsScan: [
    '${rootDir}/converters/**/*.converter.js',
    '${rootDir}/middlewares/**/*.middleware.js',
    '${rootDir}/services/**/*.js'
  ],
  mongoose: {
    url: process.env.MONGO_URL,
    connectionOptions: {
      poolSize: 10,
      user: 'admin',
      pass: 'andromia1',
      config: {
        autoCreate: true,
        autoIndex: true
      }
    }
  },
  passport: {
    secret: process.env.SECRET || 'There is no better secret than none'
  }
})
export class Server extends ServerLoader {
  public $onMountingMiddlewares(): void|Promise<void> {
    this.use(GlobalAcceptMimesMiddleware)
      .use(compress({}))
      .use(override())
      .use(parser.json())
      .use(parser.urlencoded({ extended: true }));
  }

  public $onServerInitError(err: any) {
    console.error(err);
  }
}
