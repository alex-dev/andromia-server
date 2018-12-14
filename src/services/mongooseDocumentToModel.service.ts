import { MongooseDocument } from "@tsed/mongoose";
import { Type, getClass } from "@tsed/core";
import { OwnedUnit } from "../models/ownedunit";
import { Explorateur } from "../models/explorateur";
import { Service } from "@tsed/common";

@Service()
// TODO: Remove switch and put a more generic way to get class.
export class MongooseDocumentToModelService {
  public getModel<T>(object: MongooseDocument<T>): Type<T>|undefined {
    switch ((object.constructor as any).modelName as string) {
      case OwnedUnit.name:
        return getClass(OwnedUnit);
      case Explorateur.name:
        return getClass(Explorateur);
    }
  }
}
