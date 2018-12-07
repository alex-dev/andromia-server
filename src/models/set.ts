import { IgnoreProperty, Required } from '@tsed/common';
import { Indexed, Model } from '@tsed/mongoose';

@Model()
export class Set {
  @IgnoreProperty() public _id = '';

  public constructor(
    @Indexed() @Required() public name: string
  ) { }
}
