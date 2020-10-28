const db = require("../models");
const Order = db.order;
const Op = db.Sequelize.Op;
const googleMapAPI = require("../controllers/googleMapAPI.js");
const orderStatus = require("../models/orderStatus.js")

exports.createOrder = async (req, res) => {
    const inputArrayLength = 2;
    // Validate request
    if(!req.body.origin || !req.body.destination){
        res.status(400).sendStatus({"error": "data not provided"});
        return;
    }
    let isInputDataValid = true;
    [req.body.origin,req.body.destination].forEach(elements=>{
        if(!Array.isArray(elements)) isInputDataValid = false;                          //is array
        if(elements.length !== inputArrayLength ) isInputDataValid = false;             //array length
        for(let cur = 0;cur<inputArrayLength;cur++)
            if(typeof(elements[cur])!=='string') isInputDataValid = false;                  //array elements type
    });

    if(!isInputDataValid){
        res.status(400).sendStatus({"error": "data invalid"});
        return;
    }

    
    let locationData = {
        START_LATITUDE : req.body.origin[0],
        START_LONGITUDE : req.body.origin[1],
        END_LATITUDE : req.body.destination[0],
        END_LONGITUDE : req.body.destination[1],
    }

    let response;
    let responseJson;

    try{
        response = await googleMapAPI.requestDistance(locationData);    //wait for the fetch distance result
        if(!response.ok)                                                //http response checking
            throw new Error('request fail');

        responseJson = await response.json();
        console.log(`fetch response ${JSON.stringify(responseJson)}`);
        if(responseJson.status !== 'OK' || responseJson.rows[0].elements[0].status !== 'OK')                                //API endpoint status checking
            throw new Error('API endpoint return fail');
        if(!responseJson.rows[0].elements[0].distance.value)
            throw new Error('API endpoint does not contain distance value')
    }catch(err){
        console.log(`fetch distance error ${err.toString()}`)
        res.status(500).sendStatus({"error": "Error to get distance"});
        return;
    }
    
    locationData.distance = responseJson.rows[0].elements[0].distance.value;    //set distance value to data object for insert to DB

    // Save Order & distance in the database
    Order.create(data)
    .then(result => {
        console.log(`Order insertd ${result.order_id}`)
        res.status(200).sendStatus({
                "id": result.order_id,
                "distance": result.distance,
                "status": orderStatus.toString(result.order_status)
        })
    })
    .catch(err => {
        console.log(`db fail ${err.toString()}`);
        res.status(500).sendStatus({"error":"DB insert fail"});
        return;
    });
};

// Retrieve all Orders from the database Limit by pages&limit
exports.getList = (req, res) => {
  if(!req.query.page || !req.query.limit){
    res.status(400).sendStatus({"error": "data not provided"});
    return;
  }

  if(isNaN(req.query.page)|| isNaN(req.query.limit)){
    res.status(400).sendStatus({"error": "data invalid"});
    return;
  }

  if(parseInt(req.query.page)<=0 || parseInt(req.query.limit)<=0){
    res.status(400).sendStatus({"error": "data invalid"});
    return;
  }

  const limit = parseInt(req.query.limit);
  const offset = parseInt(req.query.limit)*(parseInt(req.query.page)-1);
  console.log(`select with limit ${limit} offset ${offset}`)
  Order.findAll({
    limit : limit,
    offset : offset,
    attributes: ['order_id','distance','order_status']
  })
    .then(data => {
      res.status(200).sendStatus( data.map(row=>{ 
        row.order_status = orderStatus.toString(row.order_status);
        return row;
    }));
    })
    .catch(err => {
      res.status(500).sendStatus({"error": "db error"});
    });
};


// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Tutorial.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Tutorial was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).sendStatus({
        message: "Error updating Tutorial with id=" + id
      });
    });
};