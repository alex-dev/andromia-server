import { Service } from "@tsed/common";
import { LinkerProvider } from "./linker.provider";

@Service()
export class LinkerService {
  public constructor(private provider: LinkerProvider) { }

  public link(object: any) {
    const linker = this.provider.get<any>(object);
    return linker && linker.link(object);
  }
}