import { Middleware, IMiddleware, Response, Locals, ConverterService, ResponseData } from '@tsed/common';
import { Response as ExpressResponse } from 'express';

@Middleware()
export class LocalLocationMiddleware implements IMiddleware {
  public constructor(private converter: ConverterService) { }

  public use(
    @Locals('created') entity: any,
    @Response() response: ExpressResponse) {
    const data = this.converter.serialize(entity);

    if (data.href) {
      response.setHeader('Location', data.href);
    }
  }
}

@Middleware()
export class ResultLocationMiddleware implements IMiddleware {
  public constructor(private converter: ConverterService) { }

  public use(
    @ResponseData() entity: any,
    @Response() response: ExpressResponse) {
    const data = this.converter.serialize(entity);
    
    if (data.href) {
      response.setHeader('Location', data.href);
    }
  }
}
