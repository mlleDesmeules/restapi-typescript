/*
 |      IMPORTS
 */

import { Router, Request, Response, NextFunction } from "express";

/**
 *
 */
export class UserRouter {

	public router : Router;

	/**
	 *
	 */
	constructor ()
	{
		this.router = Router();

		this._routes();
	}

	/**
	 * @desc    This function will contain all routes for the user router.
	 *
	 * @private
	 */
	private _routes () : void
	{
		this.router.get("/", this.getAll);
		this.router.get("/:id", this.getOne);

		this.router.post("/", this.create);
		this.router.put("/:id", this.update);

		this.router.delete("/:id", this.delete);
	}
	
	/**
	 * 
	 * @param req
	 * @param res
	 * @param next
	 */
	public create (req : Request, res : Response, next : NextFunction) : void
	{

	}
	
	/**
	 * 
	 * @param req
	 * @param res
	 * @param next
	 */
	public delete (req : Request, res : Response, next : NextFunction) : void
	{

	}
	
	/**
	 * 
	 * @param req
	 * @param res
	 * @param next
	 */
	public getAll (req : Request, res : Response, next : NextFunction) : void
	{
		
	}
	
	/**
	 * 
	 * @param req
	 * @param res
	 * @param next
	 */
	public getOne (req : Request, res : Response, next : NextFunction) : void
	{
		
	}
	
	/**
	 * 
	 * @param req
	 * @param res
	 * @param next
	 */
	public update (req : Request, res : Response, next : NextFunction) : void
	{
		
	}

}

/*
 |      EXPORT
 */
export default new UserRouter().router;