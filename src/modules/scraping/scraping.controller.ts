import { Controller, Body, Post } from '@nestjs/common';
import { GenericService } from 'src/@common/services/scraping/generic/generic.service';

import { LinktreeService } from 'src/@common/services/scraping/linktree/linktree.service';
import { LnkbioService } from 'src/@common/services/scraping/lnkbio/lnkbio.service';

@Controller('scraping')
export class ScrapingController {
  constructor(
    private readonly linktreeService: LinktreeService,
    private readonly lnkbioService: LnkbioService,
    private readonly genericService: GenericService,
  ) { }

  @Post('/link-tree')
  async scrapingScript(@Body() body) {
    return await this.linktreeService.getLinksProfile(body);
  }

  @Post('/ink-bio')
  async scrapingScriptInk(@Body() body) {
    return await this.lnkbioService.getLinksProfile(body);
  }

  @Post('/export-lnk')
  async exportLink(@Body() body: { url: string }) {

    try {
      new URL(body.url);
    } catch (_) {
      return { error: "no es una url" };
    }

    if (body.url.includes("https://linktr.ee/")) {
      return await this.linktreeService.getLinksProfile(body);
    }

    if (body.url.includes("https://lnk.bio/")) {
      return await this.lnkbioService.getLinksProfile(body);
    }

    return await this.genericService.getLinksProfile(body);
  }
}
