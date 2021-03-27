const fs = require('fs');
const csv = require('csv-parser');


async function logg_files(results) {

    for (result of results) {

        if (result.ISIN != result.ISIN_check) {
            throw new Error('Error! Values of wrong ISIN scraped');
        }
        await check_files(result)
        await write_data(result)
    }
}

async function write_data(result) {

    current_date = await load_data(path)

    return new Promise((resolve, reject) => {

        path = process.env.LOGS_FOLDER + '/' + result.name + '.csv'

        data = `\n` + result.date + `;` + result.currency + `;` + result.value

        if(current_date === result.date){
            console.log(`Current date ${result.date} for ${result.name} is already existing!`)
            resolve()
            return
        }

        fs.appendFile(path, data, function (err) {
            if (err) {
                reject(err)
            } else {
                console.log(`Data in ${path} updated`)
                resolve()
            }
        })

    })

}

async function load_data(path) {

    return new Promise((resolve, reject) => {

        var rates = []

        fs.createReadStream(path)
            .pipe(csv({
                separator: ';',
                skipComments: true,
                headers: false
            }))
            .on('data', (row) => {
                rates.push(row)
            })
            .on('end', () => {
                console.log(`${path} CSV file successfully processed`);
                if(rates.length == 0){
                    console.log('length of null')
                    resolve('00.00.0000')
                }else{
                    console.log(rates)
                    resolve(rates[rates.length - 1][0])
                }
            })
            .on('error', function (err) {
                reject(err)
            });
    })
}




async function check_files(result) {

    path = process.env.LOGS_FOLDER + '/' + result.name + '.csv'

    data = `# ${result.name} ${result.ISIN}`

    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, { flag: 'wx' }, function (err) {
            if (err) {
                if (err.errno == -17) {
                    console.log(`file at ${path} already exists`)
                    resolve()

                } else {
                    console.log(err)
                    reject(err)
                }

            } else {
                console.log(`new file at ${path} was created`)
                resolve()

            }
        });

    });
}


module.exports = logg_files