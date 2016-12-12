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
	public is_completed : boolean;
	public id_author    : string;

	/**
	 *
	 * @param data
	 */
	constructor (data : { title : string, description : string, is_completed : boolean, id_author : string })
	{
		this.title        = data.title;
		this.description  = data.description;
		this.is_completed = data.is_completed;
		this.id_author    = data.id_author;
	}

}

/*
 |      SCHEMA & METHODS
 */
let schema = new Schema({
	title        : {
		type : String,
		required : true
	},
	description  : String,
	is_completed : {
		type    : Boolean,
		default : false
	},
	id_author    : {
		type     : Schema.types.ObjectId,
		ref      : "user",
		required : true,
	}
});

/*
 |      EXPORT TO-DO DOCUMENT
 */
export interface TodoDocument extends Todo, Document { }

/*
 |      EXPORT TO-DO MODEL
 */
export const Todos = model<TodoDocument>('todo', schema);