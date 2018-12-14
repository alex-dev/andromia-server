import { Service } from "@tsed/common";
import { ExplorateurLinker } from "../linkers/explorateur.linker";
import { getClass } from "@tsed/core";
import { AbstractLinker } from "../linkers/linker.abstract";
import { Explorateur } from "../models/explorateur";
import { Exploration } from "../models/exploration";
import { ExplorationLinker } from "../linkers/exploration.linker";
import { UnitLinker } from "../linkers/unit.linker";
import { OwnedUnitLinker } from "../linkers/ownedunit.linker";
import { OwnedUnit } from "../models/ownedunit";
import { Unit } from "../models/unit";
import { Mongoose } from "mongoose";
import { MongooseDocumentToModelService } from "./mongooseDocumentToModel.service";
import { ArrayLinker } from "../linkers/array.linker";

@Service()
export class LinkerProvider {
  private readonly linkers = new Map<any, any>([
    [getClass(Explorateur), new ExplorateurLinker(this)],
    [getClass(Exploration), new ExplorationLinker(this)],
    [getClass(OwnedUnit), new OwnedUnitLinker(this)],
    [getClass(Unit), new UnitLinker(this)],
    [getClass(Array), new ArrayLinker(this)]
  ]);

  public constructor(private mongoose: MongooseDocumentToModelService) { }

  public get<T>(object: any): AbstractLinker<T> {
    const target = object && object.constructor && (object.constructor.base instanceof Mongoose)
      ? this.mongoose.getModel(object)
      : getClass(object);

    return this.linkers.get(target) as AbstractLinker<T>;
  }
}