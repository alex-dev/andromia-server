import { OverrideMiddleware, AuthenticatedMiddleware as Authenticated, IMiddleware, EndpointInfo, EndpointMetadata, Request, Response } from "@tsed/common";
import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import * as passport from 'passport';

@OverrideMiddleware(Authenticated)
export class AuthenticatedMiddleware implements IMiddleware {
  private async run(strategy: string, request: ExpressRequest, response: ExpressResponse) {
    return new Promise<void>((resolve, reject) => (passport.authenticate(strategy, {
      failWithError: true
    }, (error: any, user: any) => {
      if (error || !user) {
        reject(error);
      }

      resolve(user);
    }))(request, response));
  }

  public async use(
    @EndpointInfo() endpoint: EndpointMetadata,
    @Request() request: ExpressRequest,
    @Response() response: ExpressResponse) {
    const { limitToOwner = false } = endpoint.get(Authenticated) || {};
    console.log('Authenticating...', limitToOwner);
    limitToOwner
      ? await this.run('private', request, response)
      : await this.run('public', request, response);
  }
}