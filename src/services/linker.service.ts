import { Service } from "@tsed/common";
import { AbstractLinker } from "../linkers/linker.abstract";
import { Mongoose } from "mongoose";
import { MongooseDocumentToModelService } from "./mongooseDocumentToModel.service";
import { getClass } from "@tsed/core";
import { Explorateur } from "../models/explorateur";
import { Exploration } from "../models/exploration";
import { OwnedUnit } from "../models/ownedunit";
import { Unit } from "../models/unit";
import { ExplorateurLinker } from "../linkers/explorateur.linker";
import { ExplorationLinker } from "../linkers/exploration.linker";
import { OwnedUnitLinker } from "../linkers/ownedunit.linker";
import { UnitLinker } from "../linkers/unit.linker";
import { ArrayLinker } from "../linkers/array.linker";

@Service()
export class LinkerService {
  private readonly linkers = new Map<any, any>([
    [getClass(Explorateur), new ExplorateurLinker(this)],
    [getClass(Exploration), new ExplorationLinker(this)],
    [getClass(OwnedUnit), new OwnedUnitLinker(this)],
    [getClass(Unit), new UnitLinker(this)],
    [getClass(Array), new ArrayLinker(this)]
  ]);

  public constructor(private mongoose: MongooseDocumentToModelService) { }

  public link(object: any) {
    const linker = this.get<any>(object);
    return linker && linker.link(object);
  }

  private get<T>(object: any): AbstractLinker<T> {
    const target = object && object.constructor && (object.constructor.base instanceof Mongoose)
      ? this.mongoose.getModel(object)
      : getClass(object);

    return this.linkers.get(target) as AbstractLinker<T>;
  }
}