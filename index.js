const axios = require("axios");
const Redis = require("ioredis");
const redis = new Redis();

loadData();

async function loadData() {
    let data = (await axios.get("http://www.statistik.at/verzeichnis/strassenliste/gemplzstr_6.csv")).data;

    data = data.split("\n");
    data.shift();
    data.shift();
    data.shift();
    data.pop();
    data.pop();

    for (let dataset of data) {
        dataset = dataset.split(";");
        // Gemeindekennziffer;Politische Gemeinde;Ortschaftskennziffer;Ortschaftsname;Straßenkennziffer;Straßenname;Postleitzahl;Gemeindecode

        let address = {
            gemeindekennziffer: dataset[0],
            politischeGemeinde: dataset[1],
            ortschaftskennziffer: dataset[2],
            ortschaftsname: dataset[3],
            strassenKennziffer: dataset[4],
            strassenName: dataset[5],
            postleitzahl: dataset[6],
            gemeindecode: dataset[7]
        };

        let x = await redis.hset(
            `strasse:${address.ortschaftskennziffer}:{${address.strassenKennziffer}}:${address.postleitzahl}`,
            "gemeindekennziffer", address.gemeindekennziffer,
            "politische_gemeinde", address.politischeGemeinde,
            "ortschaftskennziffer", address.ortschaftskennziffer,
            "ortschaftsname", address.ortschaftsname,
            "strassenkennziffer", address.strassenKennziffer,
            "strassenname", address.strassenName,
            "postleitzahl", address.postleitzahl
        );

        console.log(x);
    }
}