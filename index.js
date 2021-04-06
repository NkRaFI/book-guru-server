const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()


const app = express()
app.use(bodyParser.json())
app.use(cors())

const port = process.env.PORT || 5055;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jnkvp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookCollection = client.db("bookGuru").collection("books");
  const ordersCollection = client.db("bookGuru").collection("orders");

  app.post('/addBook', (req, res) => {
    const book = (req.body)
    bookCollection.insertOne(book)
      .then(result => {
        console.log(result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/getBook', (req, res) => {
    bookCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.get('/getBookById/:id', (req, res) => {
    bookCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0])
      })
  })

  app.post('/placeOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0) // start from here
      })
  })

  app.get('/orders', (req, res) => {
    ordersCollection.find({email: req.query.email})
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })

  app.delete('/deleteBook/:id', (req, res) => {
    bookCollection.deleteOne({ _id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

});
//mongodb end



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)