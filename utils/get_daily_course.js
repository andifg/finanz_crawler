const puppeteer = require('puppeteer')


async function get_course(fonds) {

  var results = [];

  const browser = await puppeteer.launch(puppeteer_mod());

  const page = await browser.newPage();


  for (let fond of fonds) {


    await page.goto('https://www.ebase.com/services/online-banking-app/',  { waitUntil: 'networkidle0'});
    await page.goto('https://portal.ebase.com/fs',  { waitUntil: 'networkidle0'});

    var variable_page_url = page.url()

    var fond_url = new URL(variable_page_url + '/p/Fonds/' + fond.ISIN);

    await page.goto(fond_url,  { waitUntil: 'networkidle0'});

    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('table tr td'))
      return tds.map(td => td.innerText)
    });

    var all_tables = JSON.stringify(data)

    let re = /\"Anteilwert.*? \((\.|\d){10}\).\",\".*?\"/;

    var found = all_tables.match(re)[0];

    var result = {};
    result.name =  fond.name
    result.ISIN = fond.ISIN
    result.ISIN_check = all_tables.match(/(?<="ISIN",")\w+(?=\",")/)[0]
    result.date = found.match(/\d\d.\d\d.\d\d\d\d/)[0]
    result.value = found.match(/(?<=,\").+(?=\s(USD|EUR)\")/)[0]
    result.currency = found.match(/(USD|EUR)/)[0]

    results.push(result)

  }

  await browser.close();

  return results
};


function puppeteer_mod (){

    let config = {
    ignoreHTTPSErrors: false,
    headless: true,
    slowMo: 150,
  }
  if (process.env.SERVER_MODE == 'true'){
    console.log('Server mode')
    config.executablePath = '/usr/bin/chromium'
    config.args = ['--no-sandbox']
  }
  return config
}

module.exports = get_course;
