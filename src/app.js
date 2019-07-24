const puppeteer = require('puppeteer');
const fs = require('fs');
const configItem = require('./config_item.json');
const exportTmpl = require('./export_tmpl.json');

puppeteer.launch({ headless: true }).then(async (browser) => {
  const startTime = Date.now();
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(true);
  await page.goto('https://free-ss.site/', { waitUntil: 'networkidle0' });

  const result = await page.evaluate(async () => {
    var els = document.querySelectorAll("#tbss [role='row']");
    els = [].slice.call(els);
    var result = [];

    els.forEach((el) => {
      if (el.className) {
        result.push({
          vtum: el.querySelector('td:nth-child(1)').innerText,
          server: el.querySelector('td:nth-child(2)').innerText,
          server_port: el.querySelector('td:nth-child(3)').innerText,
          method: el.querySelector('td:nth-child(4)').innerText,
          password: el.querySelector('td:nth-child(5)').innerText,
          country: el.querySelector('td:nth-child(7)').innerText
        });
      }
    });
    return result;
  });
  browser.close();

  const configs = result.map((item) => {
    return Object.assign({}, configItem, item, {
      remarks: `${item.country}-${item.vtum}`
    });
  });

  exportTmpl.configs = configs;
  console.log('cost time:', Date.now() - startTime);
  fs.writeFileSync('./dist/export.json', JSON.stringify(exportTmpl, null, 2));
});
