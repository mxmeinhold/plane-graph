import { exit } from "process";
import * as express from "express";
import * as cors from "cors";

import * as log from "./log";

import get_config, { Config } from "./config";

let config: Config;
try {
  config = get_config();
} catch {
  exit();
}

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
  res.status(200).json({ hello: "world" });
});

app.listen(config.port);
log.info("listening", { port: config.port });
