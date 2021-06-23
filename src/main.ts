import * as express from "express";
import * as cors from "cors";

import * as log from "./log";

declare let process: {
  env: {
    NODE_ENV: string;
    PORT: number;
  };
};

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

app.listen(process.env.PORT || 8080);
log.info("listening", { port: process.env.PORT || 8080 });
