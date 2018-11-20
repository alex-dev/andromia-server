import {ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware} from '@tsed/common';
import * as parser from 'body-parser';
import * as compress from 'compression';
import * as override from 'method-override';

@ServerSettings({
  acceptMimes: ['application/json'],
  mount: {

  },
  debug: process.env.NODE_ENV != 'prod'
})
export class Server extends ServerLoader {
  /**
   * Configure global middlewares.
   */
  public $onMountingMiddlewares(): void|Promise<any> {
    this.use(GlobalAcceptMimesMiddleware)
      .use(compress({}))
      .use(override())
      .use(parser.json())
      .use(parser.urlencoded({ extended: true }));

    return null;
  }

  public $onReady() {
    const server = this.settings.getHttpPort();
    console.log(`Server started on ${server.address}:${server.port}.`);
  }

  public $onServerInitError(err: any) {
    console.log(err);
  }
}
