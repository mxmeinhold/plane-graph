import { exit } from "process";
import * as express from "express";
import * as cors from "cors";
import { Collection, Db, MongoClient } from "mongodb";

import * as log from "./log";

import get_config, { Config } from "./config";
import { schema } from "./schema";

let config: Config;
try {
  config = get_config();
} catch {
  exit();
}

const mongo_client = new MongoClient(config.mongo_config.uri, {
  useUnifiedTopology: true,
});

let dump_db: Db;
let aircraft_col: Collection<schema>;
mongo_client
  .connect()
  .then((client) => {
    dump_db = client.db("dump1090");
    aircraft_col = dump_db.collection("aircraft");

    // Start express only after mongo is connected
    app.listen(config.port);
    log.info("listening", { port: config.port });
  })
  .catch((error) => {
    log.fatal("failed to connect to db", { error: error });
  });

// Create Express app
const app = express();

// Configure body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure cors
const corsOptions: cors.CorsOptions = {
  origin: [],
};
app.options("*", cors);
app.use(cors(corsOptions));

app.get("/", (_, res) => {
  aircraft_col
    .findOne({})
    .then((doc) => res.status(200).json(doc))
    .catch((error) => log.error("error", { route: "/", error: error }));
});
