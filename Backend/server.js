const express = require('express'); 
const app = express(); 
const PORT = 5000;

app.get('/', (req, res) => {
    res.send('Hello, World! This is the backend server running on port 5000.');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://roneelv:Yakbekithurgit@routename.enwbahs.mongodb.net/?retryWrites=true&w=majority&appName=routename";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
