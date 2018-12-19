import { Filter, IFilter, ParamRegistry } from '@tsed/common';
import { Request, Response } from 'express';
import { Explorateur } from '../models/explorateur';

@Filter()
export class UserFilter implements IFilter {
  public transform(expression: string, request: Request, response: Response): Explorateur {
    return request.user;
  }
}

export function User(): Function {
  return ParamRegistry.decorate(UserFilter, {
    useConverter: false,
    useValidation: false
  });
}
