/*
 |      IMPORTS
 */

import * as config  from "config";
import * as http    from "http";

import App      from "./App";
import Database from "./Database";
import debug    from "./shared/imports/Debug";

debug("ts-express:server");

/*
 |      CONSTANTS
 */
const port = config.get("server.port");

/*
 |      DATABASE
 */

new Database().connect();

/*
 |      APPLICATION
 */
App.set("port", port);

/*
 |      SERVER
 */
const Server = http.createServer(App);

Server.listen(port, onListening);
Server.on("error", onError);

/**
 *
 * @param error
 */
function onError (error : NodeJS.ErrnoException) : void
{
	if (error.syscall !== "listen") {
		throw error;
	}

	let bind = (typeof port === "string") ? `Pipe ${port}` : `Port ${port}`;

	switch (error.code) {
		case "EACCES" :
			console.error(`${bind} requires elevated privileges`);
			process.exit(0);
			break;
		case "EADDINUSE" :
			console.error(`${bind} is already in use`);
			process.exit(1);
			break;
		default :
			throw error;
	}
}

/**
 *
 */
function onListening () : void
{
	let addr = Server.address();
	let bind = (typeof addr === "string") ? `pipe ${addr}` : `port ${addr.port}`;

	debug(`Listening on ${bind}`);
}

/*
 |      EXPORTS
 */
export default Server;