const fetch = require('node-fetch');
var mysql = require('mysql');
 
//host config given by docker env
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'zerongjob',
    debug: false,
});
var mapAPIkey = "AIzaSyClfFPTSCVamqtUP4Lj4RQ93RtcIbVWNwk";



connection.connect();
 


app.post('/orders',async (req,res) =>{
    //auth checking here
    try{

        //params checking 
        if(req.body.origin === undefined || req.body.destination === undefined){            //provide origin & destination
            res.status(400).send('origin or destination undefined');
            return;
        }

        if(typeof(req.body.origin) !== Array|| typeof(req.body.destination) !== Array){     //origin & destination is an Array
            res.status(400).send('origin or destination is NOT a ARRAY');
            return;
        }

        if(req.body.origin.length!=2 || req.body.destination !== 2){                        //origin & destination array length must be 2
            res.status(400).send('origin or destination length not match');
            return;
        }

        req.body.origin.forEach((value)=>{                                                  //origin array does not contain string value
            if(typeof(value)!==String)
                res.status(400).send('origin Array does not contains String value');
        })

        req.body.destination.forEach((value)=>{                                             //destination array does not contain string value
            if(typeof(value)!==String)
                res.status(400).send('destination Array does not contains String value');
        })

        let start_latitude = req.body.origin[0]; 
        let start_longitude = req.body.origin[1]; 
        let end_latitude = req.body.destination[0];
        let end_longitude = req.body.destination[1];


        //main flow
        await fetch(getGoogleMapAPIURL(start_latitude,start_longitude,end_latitude,end_longitude,key), { method: 'POST'})               //request google map API
            .then(onFetchSuccess)                //(on fetch success ,  on fetch Error)
            .catch(onFetchFail)
            .then(processResult)                                          //process result after fetch success , no promise reject handle for fetch success
            .then(async distance =>await insertOrder(start_latitude,start_longitude,end_latitude,end_longitude,distance))    //(insert order , on process fail )
            .then(feedbackSuccess)      //(feedback success , insert error)
            .catch(onError);



        function getGoogleMapAPIURL(start_latitude,start_longitude,end_latitude,end_longitude,key){
            let APIEndPoint = 'https://maps.googleapis.com/maps/api/distancematrix/';
            let format = 'json';
            return `${APIEndPoint}${format}?origins=${start_latitude},${start_longitude}2&destinations=${end_latitude},${end_longitude}&key=${key}`;
        }


        function onFetchSuccess(result){
            _result = JSON.parse(result);
            if(_result.status==="OK"){               //result checking
                return Promise.resolve();
            }else{
                return Promise.reject(_result.status);
            }
        }

        function processResult(result){
            //pick distance logic here
            return Promise.resolve(distance);
        }

        function onError(err){
            res.status(400).send('fetch api error',err);
            return;
        }



        function insertOrder(distance){

            // insert statement
            let sql =   `INSERT INTO lala_odrder SET ?`;
            // insert object
            let insertObject = {
                START_LATITUDE: start_latitude,
                START_LONGITUDE: start_longitude, 
                END_LATITUDE: end_latitude,
                END_LONGITUDE: end_longitude,
                distance : distance
            }

            // execute the insert statment
            connection.query(sql,insertObject, function (error, results, fields) {
                if (error) {
                    return Promise.reject(err);
                }
                if(results){
                    return Promise.resolve(results.insertId,distance);
                }
            });
        }

        function feedbackSuccess(order_id,distance){
            res.status(200).send({
                "id":order_id,
                "distance":distance,
                "status": "UNASSIGNED"
            });
        }
    }catch(err){
        res.status(400).send('unknown error');
    }
});



app.listen(3000, () => {
    console.log('Listening on port 3000...');
  });