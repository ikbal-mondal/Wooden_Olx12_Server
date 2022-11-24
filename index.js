const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
require('dotenv').config();
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 5000;
// middle were
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.WoodenDBUSerId}:${process.env.WoodenDBpassword}@cluster0.vcnuad9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
      
    try{
     
        const homeFurnitureCollection = client.db('WOODEN_OLX').collection('FurnitureCollectionForHome');
      

    }
    finally{

    }

}
run().catch(error => console.log(error));


app.get('/', async(req,res) => {
    res.send('Wooden Olx  server is running');
    
})

app.listen(port, () => {
    console.log('Wooden Olx running on ' + port);
})