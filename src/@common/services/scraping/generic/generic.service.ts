import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import htmlToJson = require('html-to-json')

@Injectable()
export class GenericService {
  constructor(
    private httpService: HttpService
  ) {
  }

  async getLinksProfile(body) {
    const ProileWeb = await this.httpService.post(body.url)
      .toPromise()
      .then((response) => {
        return response?.data
      })
      .catch((error) => {
        return error.response.data
      });

    const links = await htmlToJson.parse(ProileWeb, function () {
      return this.map('a', function ($item) {
        return { url: $item.attr('href'), title: $item.text()?.replace(/[\n\t]/g, ' ')?.trim() };
      });
    }).then(function (items) {
      const dataArr: any = new Set(items);
      let result = [...dataArr];

      return result?.filter(item => item?.title && item?.title?.length > 0)
    }, function (err) {
    });

    return {
      length: links?.length,
      links
    }
  }

}