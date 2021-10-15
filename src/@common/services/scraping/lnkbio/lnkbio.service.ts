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
    const ProileWeb = await this.httpService.post(body.url)
      .toPromise()
      .then((response) => {
        return response?.data
      })
      .catch((error) => {
        return error.response.data
      });

    const bodyProfileLink = await htmlToJson.parse(ProileWeb,
      function ($doc) {
        return $doc.find('.pb-links').html();
      }
    );

    const bodyProfileSocialLinks = await htmlToJson.parse(ProileWeb,
      function ($doc) {
        return $doc.find('.deep-links').html();
      }
    );

    const links = await htmlToJson.parse(bodyProfileLink, function () {
      return this.map('a', function ($item) {
        return { url: `https://lnk.bio${$item.attr('href')}`, title: $item.text()?.replace(/[\n\t]/g, ' ')?.trim() };
      });
    }).then(function (items) {
      const dataArr: any = new Set(items);
      let result = [...dataArr];

      return result?.filter(item => item?.title && item?.title?.length > 0)
    }, function (err) {
    });

    let socialLinks = []

    if (bodyProfileSocialLinks)
      socialLinks = await htmlToJson.parse(bodyProfileSocialLinks, function () {
        return this.map('a', function ($item) {
          return { url: $item.attr('data-url'), type: $item.attr('data-network') };
        });
      }).then(function (items) {
        const dataArr: any = new Set(items);
        let result = [...dataArr];

        return result
      }, function (err) {
      });

    const profileImage = await htmlToJson.parse(ProileWeb,
      function ($doc) {
        return $doc.find('#profile_picture_catch_error').attr('src');
      }
    );

    const profileName = await htmlToJson.parse(ProileWeb,
      function ($doc) {
        return $doc.find('.pb-name').text()?.replace(/[\n\t]/g, ' ')?.trim();
      }
    );

    const userName = await htmlToJson.parse(ProileWeb,
      function ($doc) {
        return $doc.find('.pb-username').text();
      }
    );

    const description = await htmlToJson.parse(ProileWeb,
      function ($doc) {
        return $doc.find('.pb-bio').text();
      }
    );

    const profile = {
      name: profileName?.length > 0 && profileName,
      description,
      image: profileImage,
      userName
    }

    return {
      profile,
      length: links?.length,
      links,
      socialLinks,
    }
  }
}