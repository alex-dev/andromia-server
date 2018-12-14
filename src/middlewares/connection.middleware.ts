import { IMiddleware, Response, ResponseData, Middleware } from "@tsed/common";
import { Response as ExpressResponse } from "express";
import { Explorateur } from "../models/explorateur";
import { JWTAuthenticationService } from "../services/jwt.authentication.service";

@Middleware()
export class ConnectionMiddleware implements IMiddleware {
  public constructor(private authentication: JWTAuthenticationService) { }

  public async use(
    @ResponseData() data: Explorateur,
    @Response() response: ExpressResponse) {
    response.setHeader('X-Token', this.authentication.generateJWT(data));
  }
}