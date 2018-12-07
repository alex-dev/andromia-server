import { IgnoreProperty, Property, PropertyType, Required } from '@tsed/common';
import { Indexed, Model, Ref, Unique } from '@tsed/mongoose';
import { Location } from './location';
import { Exploration } from './exploration';
import { OwnedUnit } from './ownedunit';
import { Ability } from './rune';

export interface InputExplorateurInterface {
  email: string;
  name: string;
  password: string;
}

@Model()
export class Explorateur implements InputExplorateurInterface {
  @IgnoreProperty() public _id = '';
  
  public constructor(
    @Unique() @Required() public email: string,
    @Unique() @Required() public name: string,
    @IgnoreProperty() public password: string,
    @Indexed() @Property() public location: Location = new Location('Inoxis'),
    @Property() public inox: number = 0,
    @Property() public runes: Map<Ability, number> = new Map<Ability, number>(),
    @PropertyType(Exploration) @Ref(Exploration) public exploration: Ref<Exploration>[],
    @PropertyType(OwnedUnit) @Ref(OwnedUnit) public units: Ref<OwnedUnit>[],
  ) { }
}

export class InputExplorateur implements InputExplorateurInterface {
  public constructor(
    @Required() public email: string,
    @Required() public name: string,
    @Required() public password: string
  ) { }
}

export class Login {
  public constructor(
    @Required() public name: string,
    @Required() public password: string,
  ) { }
}
