const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
 const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();
const port = process.env.PORT || 5000;
// middle were
// app.use(cors());
const corsConfig = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.WoodenDBUSerId}:${process.env.WoodenDBpassword}@cluster0.yxnrlzt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function  verifyJWT(req,res,next,) {
   const authHeader = req.headers.authorization
   if(!authHeader){
     
     return res.status(401).send('unauthorized access')
   }
   const token = authHeader.split(' ')[1];
   jwt.verify(token, process.env.ACCES_TOKEN, function(error, decoded){
    if(error){
        return res.status(403).send({message: 'forbidden'})
    }
    req.decoded = decoded;
    next();
   })
}

async function run(){
      
    try{
     
        const FurnitureCategoriesCollection = client.db('WOODEN_OLX').collection('Categories');
        const ResellProductsCollection = client.db('WOODEN_OLX').collection('ResellProducts');
        const BookingsCollection = client.db('WOODEN_OLX').collection('Bookings');
        const UsersCollection = client.db('WOODEN_OLX').collection('Users');
        const AddProductsCollection = client.db('WOODEN_OLX').collection('AddProducts');
         
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
       
         app.get('/bookings', verifyJWT, async(req,res)=> {
            const email =req.query.email;
            const decodedEmail = req.decoded.email;
            if(email !== decodedEmail){
                return res.status(403).send({message: 'forbidden access'})
            }
            const query = {email: email};
            const bookings = await BookingsCollection.find(query).toArray();
            res.send(bookings)
         })

         app.post("/create-payment-intent", async (req, res) => {
            const booking = req.body;
            const price = booking.resale_price;
            const amount = price * 100;
        console.log(price);
            const paymentIntent = await stripe.paymentIntents.create({
              currency: "INR",
              amount: amount,
              'payment_method_types': ["card"],
            });
            console.log(paymentIntent);
            res.send({
              clientSecret: paymentIntent.client_secret,
            });
          });

          



        
             app.get('/jwt', async(req,res) => {
                const email = req.query.email;
                console.log(email);
                const query = {email: email};
                 const user = await UsersCollection.findOne(query)
                 console.log(user);
                 if(user){
                   const token = jwt.sign({email}, process.env.ACCES_TOKEN , {expiresIn: '12h'})
                  return res.status(201).send({accessToken: token})
                 }
                 
                 res.send({accessToken: ''})
             })

        app.post('/bookings',async(req,res) => {
            const booking = req.body;
            console.log(booking);
            const result = await BookingsCollection.insertOne(booking);
            res.send(result)
        });
        app.get('/bookings/:id',async(req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const booking = await BookingsCollection.findOne(query);
            res.send(booking)
        });


        
        app.post('/users' , async(req,res) => {
            const user = req.body;
            const result = await UsersCollection.insertOne(user)
            res.send(result);
        }) ;

        app.get('/users' , async(req,res) => {
         
             const query = {}
             const users = await UsersCollection.find(query).toArray();
             res.send(users)
        }) ;

        app.delete('/users/:id', async(req,res) =>{
            const id =req.params.id;
            const filter = {_id: ObjectId(id)};
            const result = await UsersCollection.deleteOne(filter);
            res.send(result)

        });

        app.get('/AddProducts/:email', async(req,res) =>{
            const email = req.params.email;
            const query ={email: email};
            const products = await ResellProductsCollection.find(query).toArray();
            res.send(products)
        });

        app.post('/AddProducts', async(req,res) =>{
            const product = req.body;
            const result = await ResellProductsCollection.insertOne(product)
            res.send(result)
        });
        app.delete('/AddProducts/:id', async(req,res) =>{
            const id =req.params.id;
            const filter = {_id: ObjectId(id)};
            const result = await AddProductsCollection.deleteOne(filter);
            res.send(result)

        });
        app.get("/user/:email",  async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await UsersCollection.findOne(query)
            res.send(user)
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



module.exports = app;