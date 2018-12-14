import { Middleware, IMiddleware, Request } from '@tsed/common'
import { Request as ExpressRequest } from 'express';

@Middleware()
export class PagingParamsMiddleware implements IMiddleware {
  public use(@Request() request: ExpressRequest) {
    request.query.page = this.convert(request.query.page, 1) - 1;
    request.query.size = this.convert(request.query.size, 25);
  }

  private convert(value: any, _default: number): number {
    if (typeof value !== 'number' || value < 1) {
      value = _default;
    }

    return value;
  }
}
