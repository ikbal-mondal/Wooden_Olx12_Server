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
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run(){
      
    try{
     
        const FurnitureCategoriesCollection = client.db('WOODEN_OLX').collection('Categories');
        const ResellProductsCollection = client.db('WOODEN_OLX').collection('ResellProducts');
        const BookingsCollection = client.db('WOODEN_OLX').collection('Bookings');
         
        app.get('/Categories', async (req,res) => {

            const query = {};
            const FurnitureCategories = FurnitureCategoriesCollection.find(query);    
            const Categories = await FurnitureCategories.toArray();
            res.send(Categories)

         });
       
        app.get('/ResellProducts', async (req,res) => {

            const query = {};
            const ResellProducts = ResellProductsCollection.find(query);    
            const ResellProduct = await ResellProducts.toArray();
            res.send(ResellProduct)

         });
         app.get('/Categories/:id', async (req,res) => {
            const id = req.params.id;
            let query = {Category_id: parseInt(id) }
            const cursor = ResellProductsCollection.find(query)
            const allCategories = await cursor.toArray();
            res.send(allCategories)
         });
       
         app.get('/bookings',async(req,res)=> {
            const email =req.query.email;
            const query = {email: email};
            const bookings = await BookingsCollection.find(query).toArray();
            res.send(bookings)
         })



        app.post('/bookings',async(req,res) => {
            const booking = req.body;
            console.log(booking);
            const result = await BookingsCollection.insertOne(booking);
            res.send(result)
        })  

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