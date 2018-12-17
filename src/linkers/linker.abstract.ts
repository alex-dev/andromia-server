import { LinkerService } from "../services/linker.service";

export abstract class AbstractLinker<T> {
  public constructor(protected provider: LinkerService) { }

  public abstract link(object: T): any;
}

export interface BasicLinkInterface {
  href: string;
}
