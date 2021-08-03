const node_udf = require('../index.js');
// const { getLastNRecords, pushBhavData } = require('../firebase/api');

const options = {
    type: "json", // optional. if not specified, zip file will be downloaded. Valid TYPES: ['json', 'csv', 'zip']
    dir: "" // optional. if not specified, files will be downloaded under NSE folder
};

const nodeUDF = new node_udf(options);

const isTodayData = (data, bhavDate) => {
    let { TIMESTAMP } = data[0];
    return bhavDate.getDate() === new Date(TIMESTAMP).getDate();
}

const bhavCopyDownload = async (myDate, dbPath = '/cash') => {
    let date = myDate == 0 || !myDate ? new Date() : myDate;
    let year = date.getFullYear();
    let month = date.toLocaleString('en-us', { month: 'short' }).toUpperCase();
    let day = date.getDate();

    let options = {
        year: year,
        month: month,
        day: day
    }

    console.log(options);
    try {
        //check if data in db
        // let data = await getLastNRecords(1, dbPath);


        // if (await isTodayData(data[0], date)) {
        //     return 'BhavCopy already updated for the day.'
        // }
        // console.log('here')

        let isfo = dbPath === '/fo';
        let bhavData = await nodeUDF.bhavdownload(options, isfo);
        console.log('here1')
        // pushBhavData(bhavData[0]);
        return "BhavCopy downloaded for the day " + day + " " + month;
    } catch (e) {
        console.log(e)
        return e;
    }
}


bhavCopyDownload()