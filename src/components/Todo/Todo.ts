/*
 |      IMPORT
 */

import { Document, Schema, model } from "mongoose";

/**
 *
 */
export class Todo {

	public title        : string;
	public description  : string;
	public isCompleted  : boolean;
	public idAuthor     : string;

	/**
	 *
	 * @param data
	 */
	constructor (data : { title : string, description : string, isCompleted : boolean, idAuthor : string })
	{
		this.title       = data.title;
		this.description = data.description;
		this.isCompleted = data.isCompleted;
		this.idAuthor    = data.idAuthor;
	}

}

/*
 |      SCHEMA & METHODS
 */
let schema = new Schema({
	title       : {
		type     : String,
		required : true,
	},
	description : String,
	isCompleted : {
		type    : Boolean,
		default : false,
	},
	idAuthor    : {
		type     : Schema.Types.ObjectId,
		ref      : "user",
		required : true,
	},
});

/*
 |      EXPORT TO-DO DOCUMENT
 */
export interface TodoDocument extends Todo, Document { }

/*
 |      EXPORT TO-DO MODEL
 */
export const Todos = model<TodoDocument>("todo", schema);