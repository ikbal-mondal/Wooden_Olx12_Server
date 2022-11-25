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
const uri = `mongodb+srv://${process.env.WoodenDBUSerId}:${process.env.WoodenDBpassword}@cluster0.yxnrlzt.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run(){
      
    try{
     
        const FurnitureCategoriesCollection = client.db('WOODEN_OLX').collection('FurnitureCategories');
      

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