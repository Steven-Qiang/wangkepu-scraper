/**
 * @file: mark.js
 * @description: mark.js
 * @package: wangkepu-scraper
 * @create: 2022-11-12 04:05:11
 * @author: qiangmouren (2962051004@qq.com)
 * -----
 * @last-modified: 2022-11-12 05:00:10
 * -----
 */

// 自动将正确答案标红
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const output = path.join(__dirname, '2000');

(async () => {
  for (const iterator of await fs.promises.readdir(output)) {
    const file = path.join(output, iterator);
    let content = await fs.promises.readFile(file, 'utf-8');
    const $ = cheerio.load(content);
    for (const body of $('font')) {
      const childNodes = body.childNodes.filter((node) => node.name != 'br');

      let start = 0;
      let end = 0;
      for (let index = 0; index < childNodes.length; index++) {
        const element = $(childNodes[index]);
        const text = element.text().trim();
        // 找到题目开头的index
        if (/\d+、/.test(text)) {
          start = index;
          continue;
        }
        // 找到正确答案的index
        if (text.startsWith('我的答案：')) {
          end = index;
          let answer = text.split('我的答案：')[1].trim();
          answer = answer.split('');
          for (let i = start; i < end; i++) {
            const element = $(childNodes[i]);
            const text = element.text().trim();
            if (answer.find((x) => text.startsWith(x))) {
              element.replaceWith(`<font color="red" style="font-size: 24px">${text}</font>`);
            }
          }
        }
      }
    }
    await fs.promises.writeFile(file, $.html());
  }
})();
