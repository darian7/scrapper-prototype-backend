import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../../../entities/users/user.entity";
import { HttpService } from "@nestjs/axios";
const htmlToJson = require('html-to-json');

@Injectable()
export class FindService {
  constructor(
    @InjectRepository(User, 'users') private readonly userRepository: Repository<User>,
    private httpService: HttpService
  ) {
  }

  async scraping(body) {
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
        return $doc.find('.sc-dQppl .mYuTj').html();
      }
    );

    const links = await htmlToJson.parse(bodyProfileLink, function () {
      return this.map('a', function ($item) {
        return $item.attr('href');
      });
    }).then(function (items) {
      return items
    }, function (err) {
    });

    return {
      length: links?.length,
      links: links?.map(link => ({ url: link }))
    }
  }

  async scrapingScript(body) {
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
        const response = $doc.find('#__NEXT_DATA__').html();
        return JSON.parse(response)
      }
    )

    let links = bodyProfileLink?.props?.pageProps?.account?.links
    let socialLinks = bodyProfileLink?.props?.pageProps?.account?.socialLinks
    let theme = bodyProfileLink?.props?.pageProps?.account?.theme

    links = links?.filter(link => link.url && link.url !== "link.url")

    return {
      length: links?.length,
      links,
      socialLinks,
      theme
    }
  }

  async scrapingScriptInk(body) {
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