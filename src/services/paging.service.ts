import { Service } from "@tsed/common";
// @ts-ignore
import * as halson from 'halson';
import * as url from 'build-url';

@Service()
export class PagingService {
  public page(host: string, path: string, data: any[], page: number, size: number, count?: number): any {
    const pages = count || count === 0 ? Math.ceil(count / size) || 1 : Infinity;
    page += 1;
    const halsondata = halson({
      size: size,
      index: page,
      items: data
    }).addLink('self', url(host, { path: path, queryParams: {
        page: page as any as string,
        size: size as any as string
      }}))
      .addLink('first', url(host, { path: path, queryParams: {
        page: '1',
        size: size as any as string
      }}))
      .addLink('prev', url(host, { path: path, queryParams: {
        page: (page > 1 ? page -1 : 1) as any as string,
        size: size as any as string
      }}))
      .addLink('next', url(host, { path: path, queryParams: {
        page: (page < pages ? page + 1 : page) as any as string,
        size: size as any as string
      }}));

    if (pages !== Infinity) {
      halsondata.total = count;
      halsondata.addLink('last', url(host, { path, queryParams: {
        page: pages as any as string,
        size: size as any as string
      }}))
    }

    return halsondata;
  }
}