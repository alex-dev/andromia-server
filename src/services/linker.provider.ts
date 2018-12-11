import { Service } from "@tsed/common";
import { ExplorateurLinker } from "../linkers/explorateur.linker";
import { getClass } from "@tsed/core";
import { LinkerInterface } from "../linkers/linker.interface";
import { Explorateur } from "../models/explorateur";
import { Exploration } from "../models/exploration";
import { ExplorationLinker } from "../linkers/exploration.linker";
import { UnitLinker } from "../linkers/unit.linker";
import { OwnedUnitLinker } from "../linkers/ownedunit.linker";
import { OwnedUnit } from "../models/ownedunit";
import { Unit } from "../models/unit";

@Service()
export class LinkerProvider {
  private readonly linkers = new Map<any, any>([
    [getClass(Explorateur), new ExplorateurLinker()],
    [getClass(Exploration), new ExplorationLinker()],
    [getClass(OwnedUnit), new OwnedUnitLinker()],
    [getClass(Unit), new UnitLinker()]
  ]);

  public get<T>(target: any): LinkerInterface<T> {
    return this.linkers.get(target) as LinkerInterface<T>;
  }
}