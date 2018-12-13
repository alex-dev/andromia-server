import { Required } from '@tsed/common';
import { Explorateur } from './explorateur';
import * as bcrypt from 'bcrypt';
import { Deprecated } from '@tsed/core';

@Deprecated('Removed when login implemented. I wish to keep algorithms around.')
export class InputExplorateur {
  @Required() public email: string;
  @Required() public name: string;
  @Required() public password: string;

  public constructor(email: string, name: string, password: string) {
    this.email = email;
    this.name = name;
    this.password = password;
  }

  public get hash(): Promise<string> {
    return bcrypt.hash(this.password, 11);
  }

  public async createExplorateur(): Promise<Explorateur> {
    return new Explorateur(this.email.toLowerCase(), this.name, await this.hash);
  }
}

@Deprecated('Removed when login implemented. I wish to keep algorithms around.')
export class Login {
  @Required() public name: string;
  @Required() public password: string;

  public constructor(name: string, password: string) {
    this.name = name;
    this.password = password;
  }

  public compare(explorateur: Explorateur): Promise<boolean> {
    return bcrypt.compare(this.password, explorateur.password);
  }
}
