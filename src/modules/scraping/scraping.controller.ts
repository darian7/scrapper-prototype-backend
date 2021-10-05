import { Controller, Body, Post } from '@nestjs/common';
import { FindService } from './services/find.service';

@Controller('scraping')
export class UserController {
  constructor(
    private readonly findService: FindService,
  ) { }

  @Post('/script')
  async scrapingScript(@Body() body) {
    return await this.findService.scrapingScript(body);
  }

  @Post('/html')
  async scraping(@Body() body) {
    return await this.findService.scraping(body);
  }

  @Post('/ink-bio')
  async scrapingScriptInk(@Body() body) {
    return await this.findService.scrapingScriptInk(body);
  }
}
