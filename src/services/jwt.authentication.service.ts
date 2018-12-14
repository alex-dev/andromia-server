import { Service, ServerSettingsService, AfterRoutesInit, Inject } from '@tsed/common';
import { MongooseModel } from '@tsed/mongoose';
import { Request } from 'express';
import { Strategy, ExtractJwt as Extract, VerifiedCallback } from 'passport-jwt';
import { Forbidden } from 'ts-httpexceptions';
import { Explorateur } from '../models/explorateur';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import { Unauthorized } from '../errors';

interface JWT {
  id: string,
  name: string;
  email: string;
  password: string;
}

@Service()
export class JWTAuthenticationService implements AfterRoutesInit {
  private readonly secret: string;
  private readonly publicjwt: Strategy;
  private readonly privatejwt: Strategy;
  
  public constructor(
    settings: ServerSettingsService,
    @Inject(Explorateur) private explorateurs: MongooseModel<Explorateur>) {
    const { secret } = settings.get('passport') as any;
    const options = {
      secretOrKey: secret,
      jwtFromRequest: Extract.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      passReqToCallback: true
    };

    this.secret = secret;
    this.publicjwt = new Strategy(options, async (request: Request, payload: any, done: VerifiedCallback) => {
      try {
        done(null, await this.validateLoggedIn(payload as JWT));
      } catch (error) {
        done(error);
      }
    });
    this.privatejwt = new Strategy(options, async (request: Request, payload: any, done: VerifiedCallback) => {
      try {
        done(null, await this.validateIsTarget(request, payload as JWT));
      } catch (error) {
        done(error);
      }
    });
  }

  public $afterRoutesInit() {
    passport.unuse('session'); // Don't want session strategy
    passport.use('public', this.publicjwt);
    passport.use('private', this.privatejwt)
  }

  public generateJWT(user: Explorateur): string {
    return jwt.sign({
      id: user._id,
      name: user.name,
      email: user.email,
      password: user.password
    }, this.secret);
  }

  private async validateLoggedIn({id, name, email, password}: JWT): Promise<Explorateur> {
    const explorateur = await this.explorateurs.findOne({
      _id: id,
      name: name,
      email: email,
      password: password
    });

    if (!explorateur) {
      throw new Unauthorized('Invalid credentials');
    }

    return explorateur;
  }

  private async validateIsTarget(request: Request, payload: JWT): Promise<Explorateur> {
    const explorateur = await this.validateLoggedIn(payload);

    if (request.params.name !== explorateur.name && request.params.name !== explorateur._id) {
      throw new Forbidden(`${ explorateur.name } cannot access the requested resources.`);
    }

    return explorateur;
  }
}
