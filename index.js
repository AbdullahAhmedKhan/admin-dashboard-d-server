const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
const pass = "BvnFInMLpW3iIUwU";
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://admin:${pass}@admin-d.fp1er4w.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const adminCollection = client.db("admin-d").collection("adminCollection");
    const userCollection = client.db("admin-d").collection("users");
    const stateCollection = client.db("admin-d").collection("states");

    app.get("/admin", async (req, res) => {
      const query = {};
      const admins = await adminCollection.find(query).toArray();
      res.send(admins);
    });
    app.get("/states", async (req, res) => {
      const query = {};
      const states = await stateCollection.find(query).toArray();
      res.send(states);
    });
    app.get("/users", async (req, res) => {
      const query = {};
      const users = await userCollection.find(query).toArray();
      res.send(users);
    });
    app.get("/users/:status", async (req, res) => {
      const status = req.params.status;
      const pending = await userCollection.findOne({ status: status });
      res.send(pending);
    });
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/servicerequest", async (req, res) => {
      const status = req.query.status;
      const query = { status: status };
      const cursor = userCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });
    app.get("/approved", async (req, res) => {
      const status = req.query.status;
      const query = { status: status };
      const cursor = userCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });
    app.put("/servicerequest/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const status = "done";
      const updateStatus = await userCollection.updateOne(query, {
        $set: { status: status },
      });
      res.send(updateStatus);
    });
    app.put("/states/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const status = "done";
      const updateStatus = await userCollection.updateOne(query, {
        $set: { status: status },
      });
      res.send(updateStatus);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from admin!");
});
app.listen(port, () => {
  console.log(`Admin app listening: ${port}`);
});
