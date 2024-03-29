import { ConverterService, OverrideMiddleware, AuthenticatedMiddleware, IMiddleware, EndpointInfo, EndpointMetadata, Request, Response } from "@tsed/common";
import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import * as passport from 'passport';
import { Unauthorized } from "../errors";

@OverrideMiddleware(AuthenticatedMiddleware)
export class AuthenticationMiddleware implements IMiddleware {
  public constructor(private converter: ConverterService) { }
  
  private async run(strategy: string, request: ExpressRequest, response: ExpressResponse) {
    return new Promise<void>((resolve, reject) => passport.authenticate(strategy, {
      failWithError: true
    }, (error: any, user: any) => {
      if (error || !user) {
        reject(error || new Unauthorized('No credentials'));
      }

      request.user = user;
      resolve(user);
    })(request, response));
  }

  public async use(
    @EndpointInfo() endpoint: EndpointMetadata,
    @Request() request: ExpressRequest,
    @Response() response: ExpressResponse) {
    const { limitToOwner = false } = endpoint.get(AuthenticatedMiddleware) || {};
    limitToOwner
      ? await this.run('private', request, response)
      : await this.run('public', request, response);
  }
}