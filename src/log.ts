type kwargs = { [key: string]: unknown };

export function log(level: string, message: string, kwargs: kwargs): void {
  // TODO configurable level, don't print debug in prod, e.g.
  // TODO stderr?
  console.log({
    level: level,
    message: message,
    timestamp: new Date().toISOString(),
    ...kwargs,
  });
}

export function debug(message: string, kwargs: kwargs): void {
  log("debug", message, kwargs);
}

export function info(message: string, kwargs: kwargs): void {
  log("info", message, kwargs);
}

export function warning(message: string, kwargs: kwargs): void {
  log("warning", message, kwargs);
}

export function error(message: string, kwargs: kwargs): void {
  log("error", message, kwargs);
}

export function fatal(message: string, kwargs: kwargs): void {
  // TODO exit?
  log("fatal", message, kwargs);
}
