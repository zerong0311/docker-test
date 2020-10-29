const { expect } = require('chai');
const supertest = require('supertest');
const api = supertest('node-load-balancer-1379515656.ap-northeast-1.elb.amazonaws.com:8080'); 

    // template of success data 
    // {
    //     'origin': ['-33.86748','151.20699'],
    //     'destination': ['-32.86748','150.20699']
    // }

describe('/orders POST with wrong origin & correct destination- create order', () => {
      it("origin array is not String", (done) => {
        api.post("/orders").send( {"origin":["abc",123],"destination":["-32.86748","150.20699"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
      });
  
      it("origin array is number", (done) => {
          api.post("/orders").send( {"origin":[123,"abc"],"destination":["-32.86748","150.20699"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
      });
  
      it("both origin array is number", (done) => {
          api.post("/orders").send( {"origin":[30624770,123],"destination":["-32.86748","150.20699"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
      });
  
      it("no origin array provided", (done) => {
          api.post("/orders").send( {"destination":["-32.86748","150.20699"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
      });
  
      it("number & NAN", (done) => {
          api.post("/orders").send( {"origin":["-33.86748","a151"],"destination":["-32.86748","150.20699"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
      });
  
      it("array more than 2 length", (done) => {
          api.post("/orders").send( {"origin":["-32.86748","150.20699","-32"],"destination":["-32.86748","150.20699"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
      });

      it("array contain symbols", (done) => {
        api.post("/orders").send( {"origin":["-32.86748","!@542"],"destination":["-32.86748","150.20699"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
      });
  
      it("origin is object,not array", (done) => {
          api.post("/orders").send( {"origin":{"-32.86748":"150.20699"},"destination":["-32.86748","150.20699"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
      });

      it("origin array contain object,not string", (done) => {
        api.post("/orders").send( {"origin":[{"-32.86748":"150.20699"},{"-32.86748":"150.20699"}],"destination":["-32.86748","150.20699"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
      });
  
  });

  describe('/orders POST with correct origin & wrong destination- create order', () => {
    it("origin array is not String", (done) => {
      api.post("/orders").send( {"origin":["-32.86748","150.20699"],"destination":["abc",123]} ).expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("origin array is number", (done) => {
        api.post("/orders").send( {"origin":["-32.86748","150.20699"],"destination":[123,"abc"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("both origin array is number", (done) => {
        api.post("/orders").send( {"origin":["-32.86748","150.20699"],"destination":[30624770,123]} ).expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("no origin array provided", (done) => {
        api.post("/orders").send( {"origin":["-32.86748","150.20699"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("number & NAN", (done) => {
        api.post("/orders").send( {"origin":["-32.86748","150.20699"],"destination":["-33.86748","a151"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("array more than 2 length", (done) => {
        api.post("/orders").send( {"origin":["-32.86748","150.20699"],"destination":["-32.86748","150.20699","-32"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("array contain symbols", (done) => {
      api.post("/orders").send( {"origin":["-32.86748","150.20699"],"destination":["-32.86748","!@542"]} ).expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("origin is object,not array", (done) => {
        api.post("/orders").send( {"origin":["-32.86748","150.20699"],"destination":{"-32.86748":"150.20699"}} ).expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("origin array contain object,not string", (done) => {
      api.post("/orders").send( {"origin":["-32.86748","150.20699"],"destination":[{"-32.86748":"150.20699"},{"-32.86748":"150.20699"}]} ).expect(400).end((err, res) => {err ? done(err) :done();});
    });

});

describe('/orders POST with correct origin & correct destination - create order', () => {
    it("correct origin & destination", (done) => {
        api.post("/orders").send( {"origin":["-33.86748","150.20699"],"destination":["-32.86748","150.20699"]} ).expect(200).end((err, res) => {
            err ? done(err) :done();});
    });
});


///orders?page=:page&limit=:limit
describe('/orders GET - orderlist', () => {
    it("correct page number and no limit", (done) => {
      api.get("/orders?page=1").send().expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("correct page number and no value of limit", (done) => {
        api.get("/orders?page=1&limit").send().expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("correct page number and a string of limit", (done) => {
      api.get("/orders?page=1&limit=abc").send().expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("correct page number and a symbol of limit", (done) => {
      api.get("/orders?page=1&limit=!(*&^").send().expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("correct page number and limit<=0", (done) => {
        api.get("/orders?page=1&limit=-1").send().expect(400).end((err, res) => {err ? done(err) :done();});
    });

    it("correct page number and limit contain decimal", (done) => {
        api.get("/orders?page=1&limit=1.2").send().expect(200).end((err, res) => {err ? done(err) :done();});
    });

});