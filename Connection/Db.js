const mongoose = require('mongoose')

// let connect= mongoose.connect('mongodb+srv://nasib001bhatt1984:723433723433@cluster0.7g1wkc8.mongodb.net/Sociality')

let connect = mongoose.connect('mongodb://localhost:27017/MetaVerse')
if(connect){
    console.log('Database is Connected Successfully...')
}
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://nasib001bhatt1984:723433723433@cluster0.7g1wkc8.mongodb.net/Sociality";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
