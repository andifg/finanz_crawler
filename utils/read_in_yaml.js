const yaml = require('js-yaml');
const fs   = require('fs');


async function read_yaml(){

   const funds = yaml.load(fs.readFileSync('./data.yml', 'utf8'));
   return funds
};

module.exports = read_yaml;