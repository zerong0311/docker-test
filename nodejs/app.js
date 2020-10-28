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


// handle undefined Routes
app.get('*', function(req, res){
  res.status(404).send({"error":'Not found'});
});

app.get('/error', (req, res) => {
  res.status(500).send({"error":'Internal server error'});
})


// app.use(globalErrHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// module.exports = app;