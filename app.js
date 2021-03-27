const read_in_yaml = require('./utils/read_in_yaml')
const crawler = require('./utils/get_daily_course.js')
const logger = require('./utils/logging.js')
var CronJob = require('cron').CronJob;
require('dotenv').config()


if(process.env.SERVER_MODE=='true'){

  var job = new CronJob('*/5 * * * *', function() {
    console.log('Job will be started at ' + new Date().toISOString());
    main()
  });
  job.start();
} else {

  main()
}

async function main() {

  try {
    const fonds = await read_in_yaml()

    const results = await crawler(fonds)

    // console.log(results)

    await logger(results)

  } catch (e) {
    console.log('Error catched!')
    console.log(e);
  }
}
