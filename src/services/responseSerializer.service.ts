import { Service, ConverterService } from "@tsed/common";
import { LinkerService } from "./linker.service";
import { isPrimitiveOrPrimitiveClass } from "@tsed/core";

@Service()
export class ResponseSerializerService {
  public constructor(private converter: ConverterService, private linker: LinkerService) { }

  public serialize(data: any): any {
    return data === null || ["number", "boolean", "string"].includes(typeof data)
      ? String(data)
      : this.merge(this.converter.serialize(data), this.linker.link(data))
  }

  private merge(data: any, link: any): any {
    if (!link) {
      return data;
    }

    for (const [key, value] of Object.entries(link)) {
      if (data[key] && !isPrimitiveOrPrimitiveClass(data[key])) {
        this.merge(data[key], value);
      } else {
        data[key] = value;
      }
    }

    return data;
  }
}
