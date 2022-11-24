const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 5000;
// middle were
app.use(cors());
app.use(express.json());




run().catch(error => console.log(error));

app.get('/', async(req,res) => {
    res.send('Doctors Portal server is running');
    
})

app.listen(port, () => {
    console.log('Doctors Portal running on ' + port);
})