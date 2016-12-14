/*
 |      IMPORTS
 */

import { User, UserDocument, Users } from "./User";
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
		/*
		 *  Define new user object
		 */
		let myUser = new User({
			email    : req.body.email,
			password : req.body.password,
			profile  : {
				firstname : req.body.firstname,
				lastname  : req.body.lastname,
			},
		});

		/*
		 *  Create new user in database
		 */
		Users
			.create(myUser, function (err : any, doc : UserDocument) {
				if (err) { return res.status(400).json(err); }

				return res.status(200).json(doc);
			});
	}
	
	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public delete (req : Request, res : Response, next : NextFunction) : void
	{
		Users
			.findByIdAndRemove(req.params.id, (err : any) => {
				if (err) { return res.status(400).json(err); }

				return res.status(200);
			});
	}
	
	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public getAll (req : Request, res : Response, next : NextFunction) : void
	{
		Users
			.find({}, "-password", (err : any, docs : Array<UserDocument>) => {
				if (err) { return res.status(400).json(err); }

				return res.status(200).json(docs);
			});
	}
	
	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public getOne (req : Request, res : Response, next : NextFunction) : void
	{
		Users
			.findById(req.params.id, "-password", (err : any, doc : UserDocument) => {
				if (err) { return res.status(400).json(err); }

				return res.status(200).json(doc);
			});
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