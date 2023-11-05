const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
console.log(process.env.DB_USERNAME);
console.log(process.env.DB_PASSWORD);

// middleware
app.use(cors());
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
    // limited data by order number
    app.get("/allfood/limited", async (req, res) => {
      const allFood =  FoodCollection .find();
      const result = await allFood.sort({order : -1}).limit(6).toArray();
      res.send(result);
    });

// limited data view details
    app.get("/foodsingle/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await FoodCollection.findOne(query);
      res.send(result);
    });

 // all food data
 app.get("/allfood", async (req, res) => {
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