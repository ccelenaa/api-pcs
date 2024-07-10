import axios from 'axios';
import {create} from 'html-pdf';

export async function htmlPdf(url, path) {
  const response = await axios.get(url);
  const html = response.data;
  const options = {
    format: 'Letter',
    width: '16in',
    height: '14in',
  };

  const htmlSansLien = html.replace(/<a[^>]*>(\s*<img.*?)<\/a>/gsi, '$1').replace(/font-size: 16px;/gsi, 'font-size: 14px;');
  
  return new Promise((resolve, reject) =>
    create(htmlSansLien, options).toFile(path, (err, res) => {
      if (err) reject(err);
      resolve(res);
    }));
}
