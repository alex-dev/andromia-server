import { OverrideMiddleware, SendResponseMiddleware as SendResponse, Response, ConverterService, ResponseData } from "@tsed/common";
import { Response as ExpressResponse } from "express";
import { NotFound } from "ts-httpexceptions";

@OverrideMiddleware(SendResponse)
export class SendResponseMiddleware extends SendResponse {
  public constructor(converter: ConverterService) { super(converter); }

  public async use(
    @ResponseData() data: any,
    @Response() response: ExpressResponse) {
    if (response.headersSent) {
      return;
    }

    if (data === undefined) {
      throw new NotFound('Requested data was not found.');
    } else {
      super.use(data, response);
    }
  }
}
