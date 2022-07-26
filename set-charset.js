/**
 * @file: set-charset.js
 * @description: 更改所有文件的编码
 * @package: wangkepu-scraper
 * @create: 2022-03-10 05:08:19
 * @author: qiangmouren (2962051004@qq.com)
 * -----
 * @last-modified: 2022-07-26 02:58:42
 * -----
 */

const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');
const output = path.relative('2000');

(async () => {
  for (const iterator of await fs.promises.readdir(output)) {
    const file = path.join(output, iterator);
    let content = iconv.decode(await fs.promises.readFile(file), 'gbk');
    content = content.replace('charset=gb2312', 'charset=utf-8');
    await fs.promises.writeFile(file, content);
  }
})();
