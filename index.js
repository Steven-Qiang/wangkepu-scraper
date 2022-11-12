/**
 * @file: index.js
 * @description: index.js
 * @package: wangkepu-scraper
 * @create: 2021-11-25 07:37:15
 * @author: qiangmouren (2962051004@qq.com)
 * -----
 * @last-modified: 2022-11-12 04:27:53
 * -----
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios').default;

const output = path.join(__dirname, '2000');
const retry = require('axios-retry');
const instance = axios.create({
  baseURL: 'http://www.iamooc.com',
  timeout: 1000 * 300,
});
retry(instance, {
  retries: 3,
});

(async () => {
  const docs_urls_set = new Set();
  const page_urls_set = new Set();
  const index_urls = ['chaoxing$.htm', 'zhihuishu$.htm', 'zhongguodaxue$.htm'];
  async function fetch(url, page = 1) {
    const pURL = url.replace('$', page);
    if (page_urls_set.has(pURL)) {
      return;
    }
    console.log(page, pURL);
    page_urls_set.add(pURL);
    let resp;
    try {
      resp = await instance.get(pURL);
    } catch (error) {}
    if (!resp) {
      console.log(page, '---', pURL, '请求失败');
      return;
    }
    const content = `${resp.data}`;
    for (const iterator of content.matchAll(/2000\/\d+.htm/g)) {
      const url = iterator[0];
      docs_urls_set.add(url);
      const filename = path.join(output, path.basename(url));
      if (fs.existsSync(filename)) continue;
      console.log('----', url);
      try {
        await instance.get(url, { responseType: 'arraybuffer' }).then(({ data }) => {
          return fs.promises.writeFile(filename, data);
        });
      } catch (error) {
        console.log('----', '下载失败');
      }
    }

    for (const [, _page] of content.matchAll(/<a href="[a-z]+\d+.htm">(\d+)<\/a>/g)) {
      if (_page == page) continue;
      await fetch(url, _page);
    }
  }
  for (const url of index_urls) {
    await fetch(url);
  }

  require('./set-charset');
  console.log('完成');
})();
