const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
// const globalErrHandler = require('./controllers/errorController');
// const AppError = require('./utils/appError');
const app = express();


// Allow Cross-Origin requests
app.use(cors());

//defined format
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Routes
app.use('/', orderRoutes);

//for testing / health check
app.get('/ping',  (req, res) =>{
  console.log(`${req.headers['x-forwarded-for'] || req.connection.remoteAddress} is pinging`);
  res.status(200).send({"success":"pong"})
});

// handle undefined Routes
app.get('*', function(req, res){
  res.status(404).send({"error":'Not found'});
});



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// module.exports = app;