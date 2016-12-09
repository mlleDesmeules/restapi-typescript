/*
 |      IMPORTS
 */

import { Router, Request, Response, NextFunction } from "express";

/**
 *
 */
export class AuthRouter {

	public router : Router;

	constructor ()
	{
		this.router = Router();

		this._routes();
	}

	/**
	 *
	 * @private
	 */
	private _routes () : void
	{
		this.router.post("/login", this.login);
		this.router.post("/register", this.register);
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public login (req : Request, res : Response, next : NextFunction) : void
	{

	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public register (req : Request, res : Response, next : NextFunction) : void
	{

	}

}

/*
 |      EXPORT
 */
export default new AuthRouter().router;