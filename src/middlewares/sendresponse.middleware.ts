import { OverrideMiddleware, IMiddleware, SendResponseMiddleware as SendResponse, Response, Request, ConverterService, ResponseData } from "@tsed/common";
import { Response as ExpressResponse, Request as ExpressRequest } from "express";
import { NotFound } from "ts-httpexceptions";
import { LinkerService } from "../services/linker.service";
import { PagingService } from "../services/paging.service";
import { ResponseSerializerService } from "../services/responseSerializer.service";

@OverrideMiddleware(SendResponse)
export class SendResponseMiddleware implements IMiddleware {
  public constructor(protected serializer: ResponseSerializerService, protected pager: PagingService) { }

  public async use(
    @ResponseData() data: any,
    @Request() request: ExpressRequest,
    @Response() response: ExpressResponse) {
    if (response.headersSent) {
      return;
    }

    if (data === undefined) {
      throw new NotFound('Requested data was not found.');
    }
    
    data = this.serializer.serialize(data);

    if (request.query.page && data instanceof Array) {
      data = this.pager.page(
        process.env.SERVER_URL as string,
        request.url,
        request.query.page,
        request.query.size,
        response.locals.count);
      response.contentType('application/json+hal');
    }

    response.json(data);
  }
}
