const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
const appRoutes = require('./routes/appRoutes.js');
const app = express();


// Allow Cross-Origin requests
app.use(cors());

//defined format &
app.use(express.urlencoded({extended:false}));
app.use(express.json({ limit: '1MB' }));

// Routes
app.use('/', orderRoutes);
app.use('/', appRoutes)


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;