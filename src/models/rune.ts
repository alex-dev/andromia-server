import { IgnoreProperty, Required } from '@tsed/common';
import { Indexed, Model } from '@tsed/mongoose';

export interface Rune {
  name: string;
}

@Model()
export class Ability implements Rune {
  @IgnoreProperty() public _id = '';

  public constructor(
    @Indexed() @Required() public name: string
  ) { }
}

@Model()
export class Weapon implements Rune {
  @IgnoreProperty() public _id = '';

  public constructor(
    @Indexed() @Required() public name: string
  ) { }
}
