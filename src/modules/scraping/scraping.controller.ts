import { Controller, Body, Post } from '@nestjs/common';

import { LinktreeService } from 'src/@common/services/scraping/linktree/linktree.service';
import { LnkbioService } from 'src/@common/services/scraping/lnkbio/lnkbio.service';

@Controller('scraping')
export class ScrapingController {
  constructor(
    private readonly linktreeService: LinktreeService,
    private readonly lnkbioService: LnkbioService,
  ) { }

  @Post('/link-tree')
  async scrapingScript(@Body() body) {
    return await this.linktreeService.getLinksProfile(body);
  }

  @Post('/ink-bio')
  async scrapingScriptInk(@Body() body) {
    return await this.lnkbioService.getLinksProfile(body);
  }
}
