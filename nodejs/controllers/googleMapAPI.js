const APIConfig = require("../config/googlemap.config.js");
const fetch = require('node-fetch');

const APIEndPoint = 'https://maps.googleapis.com/maps/api/distancematrix/';
const format = 'json';

async function requestDistance(data){
    const APIURI = getAPIURI(data);
    console.log(`fetch googlemap API - ${APIURI}`);

    const response = await fetch(APIURI, { method: 'GET'});
    return response;
}


//sample https://maps.googleapis.com/maps/api/distancematrix/json?origins=41.43206,-81.38992&destinations=42,-80&key=xxxxxxxxxxxxxxxxx
function getAPIURI(data){
    return `${APIEndPoint}${format}?origins=${data.START_LATITUDE},${data.START_LONGITUDE}2&destinations=${data.END_LATITUDE},${data.END_LONGITUDE}&key=${APIConfig.APIKEY}`;
}

module.exports.requestDistance = requestDistance;