import { LinkerProvider } from "../services/linker.provider";

export abstract class AbstractLinker<T> {
  public constructor(protected provider: LinkerProvider) { }

  public abstract link(object: T): any;
}

export interface BasicLinkInterface {
  href: string;
}
