/*
 |      IMPORTS
 */
import * as bodyParser  from "body-parser";
import * as config      from "config";
import * as express     from "express";
import * as logger      from "morgan";

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
		if (this.env === 'dev') {
			this.express.use(logger("dev"));
		}

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

		this.express.use("/", this.router);
	}

}

/*
 |      EXPORTS
 */
export default new App().express;