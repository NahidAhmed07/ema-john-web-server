const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectIb = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5400;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4v0cg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("online_shop");
    const productsCollection = database.collection("products");
    const ordersCollection = database.collection("orders");

    // get product by pagination needs
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const productCount = await cursor.count();
      let products;
      if (page) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.limit(10).toArray();
      }
      res.send({ products, productCount });
    });
    // get products by cart
    app.post("/products/bykeys", async (req, res) => {
      const keys = req.body;
      const query = { key: { $in: keys } };

      const products = await productsCollection.find(query).toArray();

      res.json(products);
    });

    // add orders information
    app.post("/orders", async (req, res) => {
      const data = req.body;
      const result = await ordersCollection.insertOne(data);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("ema-john server response ami nahid hasan moman");
});

const person = {
  name: "nahid ahmed",
  email: "mdnahidahmed2003@gmail.com",
  adde: "pabna",
};

app.get("/person", (req, res) => {
  res.send(JSON.stringify(person));
});

app.listen(port, () => {
  console.log("Ema-john server listening on port:", port);
});
