/*
 |      IMPORTS
 */

import { Todo, Todos, TodoDocument } from "./Todo";
import { Router, Request, Response, NextFunction } from "express";

/**
 * 
 */
export class TodoRouter {

	public router : Router;

	constructor ()
	{
		this.router = Router();

		this._routes();
	}

	private _routes () : void
	{
		this.router.get("/",            this.getAll);
		this.router.get("/author/:id",  this.getByAuthor);
		this.router.get("/:id",         this.getOne);

		this.router.post("/",       this.create);
		this.router.put("/:id",     this.update);

		this.router.delete("/:id",  this.delete);
	}

	public create (req : Request, res : Response, next : NextFunction) : void
	{

	}

	public delete (req : Request, res : Response, next : NextFunction) : void
	{

	}

	public getAll (req : Request, res : Response, next : NextFunction) : void
	{

	}

	public getByAuthor (req : Request, res : Response, next : NextFunction) : void
	{

	}

	public getOne (req : Request, res : Response, next : NextFunction) : void
	{

	}

	public update (req : Request, res : Response, next : NextFunction) : void
	{

	}

}

/*
 |      EXPORT
 */
export default new TodoRouter().router;