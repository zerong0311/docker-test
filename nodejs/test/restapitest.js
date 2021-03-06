const { expect } = require('chai');
const supertest = require('supertest');
// const api = supertest('node-load-balancer-1379515656.ap-northeast-1.elb.amazonaws.com:8080'); 
const api = supertest('localhos:8080'); 
const app = require('../app.js');
const e = require('express');
const { json } = require('body-parser');


// template of success data 
// {
//     'origin': ['-33.86748','151.20699'],
//     'destination': ['-32.86748','150.20699']
// }



describe('POST /orders fail to create order - wrong origin', () => {
      it("origin array is not String", (done) => {
        supertest(app).post("/orders").send( {"origin":["abc",123],"destination":["-32.86748","150.20699"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
      });
  
      it("origin array is number", (done) => {
          supertest(app).post("/orders").send( {"origin":[123,"abc"],"destination":["-32.86748","150.20699"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
      });
  
      it("both origin array is number", (done) => {
          supertest(app).post("/orders").send( {"origin":[30624770,123],"destination":["-32.86748","150.20699"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
      });
  
      it("no origin array provided", (done) => {
          supertest(app).post("/orders").send( {"destination":["-32.86748","150.20699"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
      });
  
      it("number & NAN", (done) => {
          supertest(app).post("/orders").send( {"origin":["-33.86748","a151"],"destination":["-32.86748","150.20699"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
      });
  
      it("array more than 2 length", (done) => {
          supertest(app).post("/orders").send( {"origin":["-32.86748","150.20699","-32"],"destination":["-32.86748","150.20699"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
      });

      it("array contain symbols", (done) => {
        supertest(app).post("/orders").send( {"origin":["-32.86748","!@542"],"destination":["-32.86748","150.20699"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
      });
  
      it("origin is object,not array", (done) => {
          supertest(app).post("/orders").send( {"origin":{"-32.86748":"150.20699"},"destination":["-32.86748","150.20699"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
      });

      it("origin array contain object,not string", (done) => {
        supertest(app).post("/orders").send( {"origin":[{"-32.86748":"150.20699"},{"-32.86748":"150.20699"}],"destination":["-32.86748","150.20699"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
      });
  
  });

describe('POST /orders fail to create order - wrong destination', () => {
    it("origin array is not String", (done) => {
      supertest(app).post("/orders").send( {"origin":["-32.86748","150.20699"],"destination":["abc",123]} ).expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("origin array is number", (done) => {
        supertest(app).post("/orders").send( {"origin":["-32.86748","150.20699"],"destination":[123,"abc"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("both origin array is number", (done) => {
        supertest(app).post("/orders").send( {"origin":["-32.86748","150.20699"],"destination":[30624770,123]} ).expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("no origin array provided", (done) => {
        supertest(app).post("/orders").send( {"origin":["-32.86748","150.20699"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("number & NAN", (done) => {
        supertest(app).post("/orders").send( {"origin":["-32.86748","150.20699"],"destination":["-33.86748","a151"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("array more than 2 length", (done) => {
        supertest(app).post("/orders").send( {"origin":["-32.86748","150.20699"],"destination":["-32.86748","150.20699","-32"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("array contain symbols", (done) => {
      supertest(app).post("/orders").send( {"origin":["-32.86748","150.20699"],"destination":["-32.86748","!@542"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("origin is object,not array", (done) => {
        supertest(app).post("/orders").send( {"origin":["-32.86748","150.20699"],"destination":{"-32.86748":"150.20699"}} ).expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("origin array contain object,not string", (done) => {
      supertest(app).post("/orders").send( {"origin":["-32.86748","150.20699"],"destination":[{"-32.86748":"150.20699"},{"-32.86748":"150.20699"}]} ).expect(400).end((err, res) => {err ? done(err) :done();});
    });

});

describe('POST /orders success create order', () => {
    it("correct origin & destination 1", (done) => {
        supertest(app).post("/orders").send( {"origin":["-33.86748","150.20699"],"destination":["-32.86748","150.20699"]} ).expect(200).end((err, res) => {
            err ? done(err) :done();});
    });

    it("correct origin & destination 2", (done) => {
        supertest(app).post("/orders").send( {"origin":["-32.86748","150.20699"],"destination":["-33.86748","150.20699"]} ).expect(200).end((err, res) => {
            err ? done(err) :done();});
    });
});

///orders?page=:page&limit=:limit
describe('GET/orders?page=:page&limit=:limit', () => {
    it("correct page number and no limit", (done) => {
      supertest(app).get("/orders?page=1").send().expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("correct page number and no value of limit", (done) => {
        supertest(app).get("/orders?page=1&limit").send().expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("correct page number and a string of limit", (done) => {
      supertest(app).get("/orders?page=1&limit=abc").send().expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("correct page number and a symbol of limit", (done) => {
      supertest(app).get("/orders?page=1&limit=!(*&^").send().expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("correct page number and limit<=0", (done) => {
        supertest(app).get("/orders?page=1&limit=-1").send().expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("correct page number and limit contain decimal", (done) => {
        supertest(app).get("/orders?page=1&limit=1.2").send().expect(200).end((err, res) => {err ? done(err) :done();});
    });
    
    it("correct page number and limit very large", (done) => {
        supertest(app).get("/orders?page=1&limit=987654321").send().expect(200).end((err, res) => {err ? done(err) :done();});
    });



    it("no page number and correct limit", (done) => {
        supertest(app).get("/orders?limit=1").send().expect(400).end((err, res) => {err ? done(err) :done();});
      });
  
      it("no value of page number and correct limit", (done) => {
          supertest(app).get("/orders?page=&limit=1").send().expect(400).end((err, res) => {err ? done(err) :done();});
      });
  
      it("a string of page number and correct limit", (done) => {
        supertest(app).get("/orders?page=abc&limit=1").send().expect(400).end((err, res) => {err ? done(err) :done();});
      });
  
      it("a symbol of page number and correct limit", (done) => {
        supertest(app).get("/orders?page=!(*&^&limit=1").send().expect(400).end((err, res) => {err ? done(err) :done();});
      });
  
      it("page number<=0 and correct limit", (done) => {
          supertest(app).get("/orders?page=-1&limit=1").send().expect(400).end((err, res) => {err ? done(err) :done();});
      });
  
      it("correct page number contain decimal and correct limit", (done) => {
          supertest(app).get("/orders?page=1&limit=1.2").send().expect(200).end((err, res) => {err ? done(err) :done();});
      });

      it("large page number and correct limit", (done) => {
        supertest(app).get("/orders?page=98765432&limit=10").send().expect(200).end((err, res) => {
            if(err) done(err);
            console.log(`res.text  ${res.text}`);
            done();});
    });

});




describe('create order=>get order=>take order=>get order', () => {
    var orderId;

    it(`craete data`,async ()=>{
        const createOrderResp = await supertest(app).post("/orders").send( {"origin":["-33.86748","150.20699"],"destination":["-32.86748","150.20699"]} ).expect(200);
        if(JSON.parse(createOrderResp.res.text).id)
            orderId = JSON.parse(createOrderResp.res.text).id;
        else
            throw `no id found in ${JSON.parse(createOrderResp.res.text)}`;
    });

    it(`find the orderid - ${orderId} in list with UNASSIGN status`, async() => {
        const searchOrderResp= await supertest(app).get("/orders?page=1&limit=1000").send().expect(200);
        let result = undefined;
        let jsonResponse = JSON.parse(searchOrderResp.res.text);
        
        for(var key in jsonResponse){
            if (!jsonResponse.hasOwnProperty(key)) continue;
            var obj = jsonResponse[key];
            if(obj.order_id === orderId && obj.order_status==='UNASSIGN')   //confirm order found && status=assign
                result=obj;
        }

        if(result === undefined) {
            throw(`${orderId} not found or order_status !== UNASSIGN`);
        }
    });



    it(`take order with /orders/${orderId}`, async () => {
        const takeOrderResp = await supertest(app).patch(`/orders/${orderId}`).send({"status":"TAKEN"}).expect(200);
        console.log(takeOrderResp.res.text);
        if(JSON.parse(takeOrderResp.res.text).status !== "SUCCESS")
            throw `fail to take order`;
    });



    it(`find the orderid - ${orderId} in list with TAKEN status`, async() => {
        const searchOrderResp= await supertest(app).get("/orders?page=1&limit=1000").send().expect(200);
        let result = undefined;
        let jsonResponse = JSON.parse(searchOrderResp.res.text);
        
        for(var key in jsonResponse){
            if (!jsonResponse.hasOwnProperty(key)) continue;
            var obj = jsonResponse[key];
            if(obj.order_id === orderId && obj.order_status==='TAKEN')   //confirm order found && status=assign
                result=obj;
        }

        if(result === undefined) {
            throw(`${orderId} not found or order_status !== TAKEN`);
        }
    });
});