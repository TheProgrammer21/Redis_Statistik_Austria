const axios = require('axios');
const Redis = require("ioredis");
const redis = new Redis();

loadData();

async function loadData(){
    let data = (await axios.get('http://www.statistik.at/verzeichnis/strassenliste/gemplzstr_6.csv')).data;

    data = data.split("\n");
    data.shift();
    data.shift();
    data.shift();
    data.pop();
    data.pop();

    redis.set("foo", "bar");
}