const db = require("../models");
const OrderService = require("../service/orderService.js");
const Op = db.Sequelize.Op;
const googleMapAPI = require("../controllers/googleMapAPI.js");
const orderStatus = require("../models/orderStatus.js")

exports.createOrder = async (req, res) => {
  // Validate request
    try{
      const inputArrayLength = 2;
      if(!req.body.origin || !req.body.destination){
          res.status(400).send({"error": "data not provided"});
          return;
      }
      let isInputDataValid = true;
      [req.body.origin,req.body.destination].forEach(elements=>{
          if(!Array.isArray(elements)) isInputDataValid = false;                          //is array
          if(elements.length !== inputArrayLength ) isInputDataValid = false;             //array length
          for(let cur = 0;cur<inputArrayLength;cur++){
              if(typeof(elements[cur])!=='string') isInputDataValid = false;             //array elements == string
              if(isNaN(elements[cur])) isInputDataValid = false;                  //array elements is NOT A NUMBER
          }
      });

      if(!isInputDataValid){
          res.status(400).send({"error": "data invalid"});
          return;
      }
    }catch(err){
      res.status(500).send({"error":"data validation error"})
    }
    let START_LATITUDE = req.body.origin[0],
    START_LONGITUDE = req.body.origin[1],
    END_LATITUDE = req.body.destination[0],
    END_LONGITUDE = req.body.destination[1];

    //get distance From Google MAP API
    let distance = undefined;
    try{
        const response = await googleMapAPI.requestDistance({ 
            START_LATITUDE : START_LATITUDE,
            START_LONGITUDE : START_LONGITUDE,
            END_LATITUDE : END_LATITUDE,
            END_LONGITUDE : END_LONGITUDE,
          });    //wait for the fetch distance result
        if(!response.ok)                                                       //http response checking
            throw new Error('request fail');

        const responseJson = await response.json();
        console.log(`fetch response ${JSON.stringify(responseJson)}`);
        if(responseJson.status !== 'OK' || responseJson.rows[0].elements[0].status !== 'OK')      //API endpoint status checking
            throw new Error('API endpoint return fail');
        if(!responseJson.rows[0].elements[0].distance.value)
            throw new Error('API endpoint does not contain distance value')
        distance = responseJson.rows[0].elements[0].distance.value;
    }catch(err){
        console.log(`fetch distance error ${err.toString()}`)
        res.status(500).send({"error": "Error to get distance"});
        return;
    }

    // insert Data To DB
    try{
      const createResult = await OrderService.create(
        START_LATITUDE,
        START_LONGITUDE,
        END_LATITUDE,
        END_LONGITUDE,
        distance
        );
        
      console.log(`Order insertId ${createResult.order_id}`);
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
  // Validate request
  try{
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
  }catch(err){
    res.status(500).send({"error":"data validation error"})
  }


  //fine all from db
  try{
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.limit)*(parseInt(req.query.page)-1);
    console.log(`select with limit ${limit} offset ${offset}`)

    let findResult = await OrderService.findAll(limit,offset);
    console.log(`findResult ${findResult}`);
    res.status(200).send( findResult.map(row=>{ 
      row.order_status = orderStatus.toString(row.order_status);      //map int status => String status
      return row;
    }));
    

  }catch(err){
    console.log(`db error ${err.toString()}`);
    res.status(500).send({"error": "db error"});
  }
};


// Update a Tutorial by the id in the request
exports.takeOrder = async (req, res) => {
  // Validate request
  try{
    if(!req.params.id || isNaN(req.params.id)){
      res.status(400).send({"error": "data invalid"});
      return;
    }
    if(!req.body.status || req.body.status!=='TAKEN'){
      res.status(400).send({"error": "data invalid"});
      return;
    }
  }catch(err){
    res.status(500).send({"error":"data validation error"})
  }

  //Find and update status in DB
  try{
    const order_id = req.params.id;
    let findResult = await OrderService.findOne(order_id)
    if(findResult===null){
      console.log(`orderID ${order_id} not found in db`);
      res.status(400).send({"error": "order not found"})
    }

    switch(findResult.order_status){
      case orderStatus.ENUM.UNASSIGN:
            let updateResult = await OrderService.update({order_status:orderStatus.ENUM.TAKEN},{where:{order_id:order_id}})
            console.log(`updated order status to ${updateResult}`);
            res.status(200).send({"status": "SUCCESS"})
          break;
      case orderStatus.ENUM.TAKEN:
        res.status(400).send({"error": "order already taken"});
        return;
      case orderStatus.ENUM.OTHERS:
        res.status(400).send({"error": "order can not take now"});
        return;
        default:
          res.status(400).send({"error": "unknown order status"});
          return;
    }
    


  }catch(err){
    console.log(`db error ${err.toString()}`);
    res.status(500).send({"error": "db error"});
  };
};