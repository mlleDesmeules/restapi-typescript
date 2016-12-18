/*
 |      IMPORTS
 */

const config = require("config");
const flash  = require("connect-flash");

import * as bodyParser  from "body-parser";
import * as express     from "express";
import * as logger      from "morgan";
import * as session     from "express-session";

import AuthRouter from "./components/Authentication/Auth.router";
import UserRouter from "./components/Users/User.router";

/**
 *
 */
export class App {

	public express : express.Application;
	public env     : String;
	public router  : express.Router;

	/**
	 *  App constructor
	 */
	constructor ()
	{
		this.env     = process.env.NODE_ENV;
		this.express = express();
		this.router  = express.Router();

		this._middleware();
		this._routes();
	}

	/**
	 * @desc    Define all middleware used in our application
	 *
	 * @private
	 */
	private _middleware () : void
	{
		if (this.env === "dev") {
			this.express.use(logger("dev"));
		}

		this.express.use(flash());

		this.express.use(session({
			secret            : config.get("passport.secret"),
			resave            : false,
			saveUninitialized : true,
			cookie            : { secure : true },
		}));

		this.express.use(bodyParser.json());
		this.express.use(bodyParser.urlencoded({ extended : false }));
	}

	/**
	 * @desc    Define all routes for our application
	 *
	 * @private
	 */
	private _routes () : void
	{
		this.router.get("/", (req, res, next) => {
			res.status(200).json({ message : "Default Route" });
		});

		this.express.use("/api/auth", AuthRouter);
		this.express.use("/api/user", UserRouter);

		this.express.use("/", this.router);
	}

}

/*
 |      EXPORTS
 */
export default new App().express;