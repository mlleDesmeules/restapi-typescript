/*
 |      IMPORTS
 */

import * as Mongoose from "mongoose";
import debug         from "./shared/Debug";

const config  = require( "config" );
const Promise = require( "promise" );

/**
 *
 */
export default class Database {

	public database;

	private _host : string;
	private _port : string;
	private _user : string;
	private _password : string;
	private _database_name : string;

	constructor ()
	{
		this.database = Mongoose;

		this._getConfig();
		this._registerListener();
	}
	
	/**
	 * @desc    This function will call the _defineConnection function to get the connection string, then will connect
	 * mongoose to the database. Before connecting the database, define the promise library that mongoose should use.
	 */
	public connect () : void
	{
		let connection = this._defineConnection();
		
		//  define the promise library that mongoose should use.
		this.database.Promise = Promise;
		
		this.database.connect(connection);
	}
	
	/**
	 * @desc    This function will create the connection string with all the information inside the config file. This way
	 * there is no need to know the structure of the connection string to be able to connect to the database.
	 *
	 * @returns {string}
	 * @private
	 */
	private _defineConnection () : string {
		let connection : string = "mongodb://";
		
		if (this._user.length > 0) {
			connection = `${connection}${this._user}:${this._password}@`;
		}
		
		connection = `${connection}${this._host}:${this._port}/${this._database_name}`;
		
		return connection;
	}

	/**
	 * @desc    This function will save every config from the config file into variables for this class, so it is easier to
	 * use. If no host is defined, then localhost will be set. If no port is defined, then 27017 will be set. Since user and
	 * password are optionals, no default values will be defined. However the database name is required and will throw an
	 * Error if not defined inside the config file.
	 *
	 * @throws  {Error} 'Database name is required'
	 *
	 * @private
	 */
	private _getConfig () : void
	{
		this._host          = (config.get("database.host")) ? config.get("database.host") : "localhost";
		this._port          = (config.get("database.port")) ? config.get("database.port") : "27017";
		this._user          = config.get("database.user");
		this._password      = config.get("database.password");
		this._database_name = config.get("database.database");

		if (!this._database_name.length) {
			throw new Error("Database name is required");
		}
	}

	/**
	 *
	 * @private
	 */
	private _registerListener () : void
	{
		Mongoose.connection.on("connected", () => {
			debug("Mongoose default connection open on : " + this._database_name);
		});

		Mongoose.connection.on("error", (err) => {
			debug("Mongoose default connection error : " + err);
		});

		Mongoose.connection.on("disconnected", () => {
			debug("Mongoose default connection disconnected");
		});
	}
}

/*
 |      EXPORT
 */
export let db = new Database().database;