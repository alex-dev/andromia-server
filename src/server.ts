import { ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware, AuthenticatedMiddleware } from '@tsed/common';
import '@tsed/mongoose';
import * as passport from 'passport';
import * as parser from 'body-parser';
import * as compress from 'compression';
import * as override from 'method-override';
import * as Path from 'path';
import * as cors from 'cors';

@ServerSettings({
  debug: process.env.NODE_ENV != 'prod',
  httpPort: process.env.PORT,
  httpsPort: false,
  rootDir: Path.resolve(__dirname),
  acceptMimes: ['application/json'],
  mount: {
    '/': '${rootDir}/controllers/**/*.controller.?s'
  },
  componentsScan: [
    '${rootDir}/converters/**/*.converter.?s',
    '${rootDir}/middlewares/**/*.middleware.?s',
    '${rootDir}/services/**/*.?s'
  ],
  mongoose: {
    url: process.env.MONGO_URL,
    connectionOptions: {
      poolSize: 10,
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASSWORD
    }
  },
  passport: {
    secret: process.env.SECRET || 'There is no better secret than none'
  }
})
export class Server extends ServerLoader {
  public $onMountingMiddlewares(): void|Promise<void> {
    this.use(GlobalAcceptMimesMiddleware)
      .use(cors({ exposedHeaders: ['Location', 'X-Token'] }))
      .use(compress({}))
      .use(override())
      .use(parser.json())
      .use(parser.urlencoded({ extended: true }))
      .use(passport.initialize());
  }
}
