import { IgnoreProperty, Property, PropertyType, Required } from '@tsed/common';
import { Indexed, Model, Ref, Unique } from '@tsed/mongoose';
import { Ability, Location } from './types';
import { Exploration } from './exploration';
import { OwnedUnit } from './ownedunit';
import { UserInterface } from './user.interface';

@Model()
export class Explorateur implements UserInterface {
  @IgnoreProperty() public _id = '';
  @Unique() @Required() public email: string;
  @Unique() @Required() public name: string;
  @IgnoreProperty() public password: string;
  @Indexed() @Property() public location: Location = 'Inoxis';
  @Property() public inox: number = 0;
  @Property() public runes: Map<Ability, number> = new Map<Ability, number>();
  @PropertyType(Exploration) @Ref('Exploration') public exploration: Ref<Exploration>[] = [];
  @PropertyType(OwnedUnit) @Ref('OwnedUnit') public units: Ref<OwnedUnit>[] = [];

  public constructor(email: string, name: string, password: string) {
    this.email = email;
    this.name = name;
    this.password = password;
  }
}
