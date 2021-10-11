import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import htmlToJson = require('html-to-json')

@Injectable()
export class LnkbioService {
  constructor(
    private httpService: HttpService
  ) {
  }

  async getLinksProfile(body) {
    const linktreeProileWeb = await this.httpService.post(body.url)
      .toPromise()
      .then((response) => {
        return response?.data
      })
      .catch((error) => {
        return error.response.data
      });

    const bodyProfileLink = await htmlToJson.parse(linktreeProileWeb,
      function ($doc) {
        return $doc.find('.pb-links').html();
      }
    );

    const links = await htmlToJson.parse(bodyProfileLink, function () {
      return this.map('a', function ($item) {
        return $item.attr('href');
      });
    }).then(function (items) {
      const dataArr = new Set(items);
      let result = [...dataArr];

      return result
    }, function (err) {
    });

    return {
      length: links?.length,
      links: links?.map(link => ({ url: link }))
    }
  }
}