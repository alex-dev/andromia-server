import { ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware } from '@tsed/common';
import * as parser from 'body-parser';
import * as compress from 'compression';
import * as override from 'method-override';
import * as Path from 'path';

@ServerSettings({
  rootDir: Path.resolve(__dirname),
  httpPort: process.env.SERVER_PORT_HTTP,
  httpsPort: process.env.SERVER_PORT_HTTPS,
  acceptMimes: ['application/json'],
  mount: {
    '': '${rootDir}/controllers/**/*.controller.js'
  },
  componentsScan: [
    '${rootDir}/converters/**/*.converter.js',
    '${rootDir}/linkers/**/*.linker.js',
    '${rootDir}/services/**/*.js'
  ],
  debug: process.env.NODE_ENV != 'prod'
})
export class Server extends ServerLoader {
  /**
   * Configure global middlewares.
   */
  public $onMountingMiddlewares(): void|Promise<void> {
    this.use(GlobalAcceptMimesMiddleware)
      .use(compress({}))
      .use(override())
      .use(parser.json())
      .use(parser.urlencoded({ extended: true }));
  }

  public $onInit() {
    // TODO: Database
  }

  public $onServerInitError(err: any) {
    console.error(err);
  }
}
