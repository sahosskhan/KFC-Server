const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;


// middleware
app.use(cors({
  origin: [
      'http://localhost:5173', "https://kfc-kushtia-bd.web.app"
 
  ],
  credentials: true
}));
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.x63gjwg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {



    const FoodCollection = client.db("FoodStore").collection("AllFood");
    const CartCollection = client.db("FoodStore").collection("CartFood");

// // all food data
app.get("/allfoods", async (req, res) => {

  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 9;
    const skip = (page - 1) * size;
  console.log("pagination query", page, size);
    // return res.send(search);
    const query = { name: { $regex: search, $options: "i" }}
    const allFood =  FoodCollection.find(query);
    const result = await allFood
    .skip(skip )
    .limit(size)
    .toArray();
    const count = await FoodCollection.countDocuments();
    const data = {skip,size,count,page,result}
    res.send(data);
  } catch (error) {
    console.log(error);
    
  }
  });


    // limited data by order number
    app.get("/allfoods/limited", async (req, res) => {
      const allFood =  FoodCollection .find();
      const result = await allFood.sort({order : -1}).limit(6).toArray();
      res.send(result);
    });



 


app.get("/myaddfood", async (req, res) => {
  const allFood =  FoodCollection .find();
  const result = await allFood.toArray();
  res.send(result);
});



 // all food data single
 app.get("/allsinglefood/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await FoodCollection.findOne(query);
  res.send(result);
});

// add food 
app.post("/allfoods", async (req, res) => {
 try {
  const SingleFoodAdd = req.body;
  console.log(SingleFoodAdd);
  const result = await FoodCollection.insertOne(SingleFoodAdd);
  res.send(result);
 }
  catch (error) {
    console.log(error);
  
 }
});

app.post("/addCarts", async (req, res) => {
  const Cart = req.body;
  const result = await CartCollection.insertOne(Cart);
  res.send(result);
});

app.get("/addCarts", async (req, res) => {
  let query = {};
  if (req.query?.email) {
    query = { buyEmail: req.query.email };
  }
  const result = await CartCollection.find(query).toArray();
  res.send(result);
});

app.delete("/addCarts/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await CartCollection.deleteOne(query);
  res.send(result);
});


//update
app.get("/update/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await FoodCollection.findOne(query);
  res.send(result);
});
 
app.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updateContent = req.body;
  const content = {
    $set: {
      name: updateContent.name,
      details: updateContent.details,
      category: updateContent.category,
      quantity: updateContent.quantity,
      price: updateContent.price,
      origin: updateContent.origin,
      image: updateContent.image,
    },
  };
  const result = await FoodCollection.updateOne(
    filter,
    content,
    options
  );
  res.send(result);
});







    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);















app.get('/', (req, res) => {
  res.send('Welcome To Restaurant Server ')
})

app.listen(port, () => {
  console.log(`Restaurant Server listening on port ${port}`)
})