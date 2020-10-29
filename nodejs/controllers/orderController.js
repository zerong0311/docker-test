const db = require("../models");
const Order = db.order;
const Op = db.Sequelize.Op;
const googleMapAPI = require("../controllers/googleMapAPI.js");
const orderStatus = require("../models/orderStatus.js")

exports.createOrder = async (req, res) => {
    const inputArrayLength = 2;
    // Validate request
    if(!req.body.origin || !req.body.destination){
        res.status(400).send({"error": "data not provided"});
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
        res.status(400).send({"error": "data invalid"});
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
        res.status(500).send({"error": "Error to get distance"});
        return;
    }
    
    locationData.distance = responseJson.rows[0].elements[0].distance.value;    //set distance value to data object for insert to DB

    try{
      let createResult = await Order.create(locationData);
      console.log(`Order insertId ${createResult.order_id}`)
      res.status(200).send({
              "id": createResult.order_id,
              "distance": createResult.distance,
              "status": orderStatus.toString(createResult.order_status)
      })
      return;

    }catch(err){
      console.log(`db fail ${err.toString()}`);
        res.status(500).send({"error":"DB insert fail"});
        return;
    }

};

// Retrieve all Orders from the database Limit by pages&limit
exports.getList = async (req, res) => {
  if(!req.query.page || !req.query.limit){
    res.status(400).send({"error": "data not provided"});
    return;
  }

  if(isNaN(req.query.page)|| isNaN(req.query.limit)){
    res.status(400).send({"error": "data invalid"});
    return;
  }

  if(parseInt(req.query.page)<=0 || parseInt(req.query.limit)<=0){
    res.status(400).send({"error": "data invalid"});
    return;
  }

  const limit = parseInt(req.query.limit);
  const offset = parseInt(req.query.limit)*(parseInt(req.query.page)-1);
  console.log(`select with limit ${limit} offset ${offset}`)

  try{
    let findResult = await Order.findAll({
      limit : limit,
      offset : offset,
      attributes: ['order_id','distance','order_status']
    })

    res.status(200).send( findResult.map(row=>{ 
      row.order_status = orderStatus.toString(row.order_status);
      return row;
    }));
    

  }catch(err){
    console.log(`db error ${err.toString()}`);
    res.status(500).send({"error": "db error"});
  }
};


// Update a Tutorial by the id in the request
exports.takeOrder = async (req, res) => {
  if(!req.params.id || isNaN(req.params.id)){
    res.status(400).send({"error": "data invalid"});
    return;
  }
  const order_id = req.params.id;


  try{
    let findResult = await Order.findOne({
      where:{order_id:order_id}
    })
    
    if(findResult===null){
      res.status(400).send({"error": "order not found"})
    }

    switch(data.order_status){
      case orderStatus.ENUM.UNASSIGN:
            let result = await Order.update({order_status:orderStatus.ENUM.TAKEN},{where:{order_id:order_id}})
            console.log(result);
            res.status(200).send({"status": "SUCCESS"})
          break;
        case orderStatus.ENUM.TAKEN:
          res.status(400).send({"error": "order already taken"});
          return;
          break;
        case orderStatus.ENUM.OTHERS:
          res.status(400).send({"error": "order can not take now"});
          return;
          break;
    }
    


  }catch(err){
    console.log(`db error ${err.toString()}`);
    res.status(500).send({"error": "db error"});
  };
};