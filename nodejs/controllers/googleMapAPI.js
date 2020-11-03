const APIConfig = require("../config/googlemap.config.js");
const fetch = require('node-fetch');

const APIEndPoint = 'https://maps.googleapis.com/maps/api/distancematrix/';
const format = 'json';

async function requestDistance(START_LATITUDE,START_LONGITUDE,END_LATITUDE,END_LONGITUDE){
    const APIURI = getAPIURI(START_LATITUDE,START_LONGITUDE,END_LATITUDE,END_LONGITUDE);
    console.log(`fetch googlemap API - ${APIURI}`);

    const response = await fetch(APIURI, { method: 'GET'});
    const responseJson = await response.json();

    if(responseJson.status !== 'OK')      //API endpoint status checking
        throw new Error(`API endpoint return fail ,status != OK ${responseJson}`);

    let returnResult = [];
    responseJson.rows.forEach(elements =>{                  // loop all rows result;
        console.log(`looping elements ${elements}`)

        //make object loop as array
        for(var key in elements){
            if (!elements.hasOwnProperty(key)) continue;
            var obj = elements[key];
            obj.forEach(valueInElements => {
                console.log(valueInElements);
                if(valueInElements.status === 'OK')
                returnResult.push(value.distance.value);
            });
        }
    })
    console.log(returnResult);

    return returnResult;
}


//sample https://maps.googleapis.com/maps/api/distancematrix/json?origins=41.43206,-81.38992&destinations=42,-80&key=xxxxxxxxxxxxxxxxx
function getAPIURI(START_LATITUDE,START_LONGITUDE,END_LATITUDE,END_LONGITUDE){
    return `${APIEndPoint}${format}?origins=${START_LATITUDE},${START_LONGITUDE}&destinations=${END_LATITUDE},${END_LONGITUDE}&key=${APIConfig.APIKEY}`;
}

module.exports.requestDistance = requestDistance;