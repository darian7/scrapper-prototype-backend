import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import htmlToJson = require('html-to-json')

@Injectable()
export class LinktreeService {
  constructor(
    private httpService: HttpService
  ) {
  }

  async getLinks(body) {
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
        const response = $doc.find('#__NEXT_DATA__').html();
        return JSON.parse(response)
      }
    )

    let links = bodyProfileLink?.props?.pageProps?.account?.links
    let socialLinks = bodyProfileLink?.props?.pageProps?.account?.socialLinks
    let theme = bodyProfileLink?.props?.pageProps?.account?.theme
    const profile = {
      name: bodyProfileLink?.props?.pageProps?.pageTitle,
      description: bodyProfileLink?.props?.pageProps?.description,
      image: bodyProfileLink?.props?.pageProps?.profilePictureUrl,
    }

    links = links?.filter(link => link.url && link.url !== "link.url")

    return {
      profile,
      length: links?.length,
      links,
      socialLinks,
      theme,
    }
  }
}