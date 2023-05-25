const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5001;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@boredombuster.wytllzp.mongodb.net/?retryWrites=true&w=majority;`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
	writeConcern: { w: "majority" },
});

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();

		const gameCollection = client.db("BoredomBuster").collection("BoardGames");
		// const bookingCollection = client.db("carDoctor").collection("bookings");

		// All Games
		app.get("/games", async (req, res) => {
			const cursor = gameCollection.find();
			const result = await cursor.toArray();
			res.send(result);
		});

		// Specific Games
		app.get("/games/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await gameCollection.findOne(query);
			res.send(result);
		});

		//Add A Game
		app.post("/games", async (req, res) => {
			const game = req.body;
			console.log(game);
			const result = await gameCollection.insertOne(game);
			res.send(result);
		});

		// app.patch("/bookings/:id", async (req, res) => {
		// 	const id = req.params.id;
		// 	const filter = { _id: new ObjectId(id) };
		// 	const updatedBooking = req.body;
		// 	console.log(updatedBooking);
		// 	const updateDoc = {
		// 		$set: {
		// 			status: updatedBooking.status,
		// 		},
		// 	};
		// 	const result = await bookingCollection.updateOne(filter, updateDoc);
		// 	res.send(result);
		// });

		// My Games
		app.get("/mygames", async (req, res) => {
			console.log(req.query);
			let query = {};
			if (req.query?.seller_email) {
				query = { seller_email: req.query.seller_email };
			}
			const result = await gameCollection.find(query).toArray();
			res.send(result);
		});

		app.delete("/games/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await gameCollection.deleteOne(query);
			res.send(result);
		});

		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("doctor is running");
});

app.listen(port, () => {
	console.log(`Car Doctor Server is running on port ${port}`);
});
