const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tuofi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//Connect database 
async function run() {
    try {

        //Connect database 
        await client.connect();
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");
        const newServicesCollection = database.collection("newServices");


        //Load services from server use get api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //get api use single service load
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('Getting specific service', id)
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
            // /console.log(service);
        })

        // get api use single service load
        app.get("/allOrders", async (req, res) => {
            const result = await servicesCollection.find({}).toArray();
            res.send(result);
            console.log(result);
        });

        // Create a document to insert use Post Api
        app.post('/newServices', async (req, res) => {
            const service = req.body;
            console.log('Hit the post api', service);
            const result = await newServicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

        //Delete api services
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

        //Addded  order api
        app.post('/services', async (req, res) => {
            const order = req.body;
            const result = newServicesCollection.insertOne(order);
            res.json(result);
        })

    }
    finally {
        //await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Running Genius Server');
});
app.listen(port, () => {
    console.log('Running Genius server on port', port);
});