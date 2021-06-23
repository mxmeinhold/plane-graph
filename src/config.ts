import { existsSync, readFileSync } from "fs";
import * as log from "./log";

export type Config = {
  node_env: string;
  config_path: string; // path to config file
  port: number; // Port to serve the UI on
  cors_origins: string[]; // list of permitted cors origins
};

/**
 * Update base with all the fields in update
 * @param base the object to update
 * @param update the fields to update
 * @returns a new object with updated fields
 */
function update<T>(base: T, update: Partial<T>): T {
  return { ...base, ...update };
}

declare let process: {
  env: {
    NODE_ENV: string;
    PORT: number;
    CONFIG_PATH: string;
  };
};

function read_config_from_env(): Partial<Config> {
  const config: Partial<Config> = {};
  if (process.env.NODE_ENV) config.node_env = process.env.NODE_ENV;
  if (process.env.PORT) config.port = process.env.PORT;
  if (process.env.CONFIG_PATH) config.config_path = process.env.CONFIG_PATH;
  return config;
}

function read_config_from_file(filepath: string): Partial<Config> {
  return <Partial<Config>>JSON.parse(readFileSync(filepath, "utf8"));
}

/**
 * Get a config from either a user defined config file path, or from the defaults
 * @param filepath User defined config file path
 * @returns the extracted config
 * @throws when no config is found
 */
function pick_config_file(filepath?: string): Partial<Config> {
  if (filepath) {
    if (existsSync(filepath)) {
      log.info("using config file", { filepath: filepath });
      return read_config_from_file(filepath);
    } else {
      log.error(
        "custom config file not found, falling back to default configs",
        { filepath: filepath }
      );
    }
  }

  if (existsSync("./config.json")) {
    log.info("using config file", { filepath: "./config.json" });
    return read_config_from_file("./config.json");
  } else if (existsSync("./config.example.json")) {
    log.info("using config file", { filepath: "./config.example.json" });
    return read_config_from_file("./config.example.json");
  } else {
    log.error(
      "No config file found. Please create './config.json', or define CONFIG_PATH.",
      {}
    );
    throw "Config not found";
  }
}

/**
 * Get configuration from the environment and config files
 * @returns the extracted config
 * @throws if no configuration file can be found
 */
export default function get_config(): Readonly<Config> {
  let config: Config = {
    node_env: "development",
    config_path: "",
    port: 8080,
    cors_origins: [],
  };

  // Read from the environment first, in case a config path is defined, then
  // override the file configuration with environment configuration
  const env_config = read_config_from_env();
  config = update(config, pick_config_file(env_config.config_path));
  config = update(config, env_config);

  // Helpful debug printout
  if (config.node_env === "development") log.debug("config", config);

  return <Readonly<Config>>config;
}
