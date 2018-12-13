import { ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware } from '@tsed/common';
import '@tsed/mongoose';
import * as parser from 'body-parser';
import * as compress from 'compression';
import * as override from 'method-override';
import * as Path from 'path';

@ServerSettings({
  debug: process.env.NODE_ENV != 'prod',
  rootDir: Path.resolve(__dirname),
  httpsPort: process.env.PORT,
  acceptMimes: ['application/json'],
  mount: {
    '': '${rootDir}/controllers/**/*.controller.js'
  },
  componentsScan: [
    '${rootDir}/converters/**/*.converter.js',
    '${rootDir}/linkers/**/*.linker.js',
    '${rootDir}/services/**/*.js'
  ],
  mongoose: {
    url: process.env.MONGO_URL,
    connectionOptions: {
      poolSize: 10,
      user: '',
      pass: '',
      config: {
        autoCreate: true,
        autoIndex: true
      }
    }
  }
})
export class Server extends ServerLoader {
  public $onInit() {

    // TODO: Database
  }

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
