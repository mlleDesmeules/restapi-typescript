/*
 |      IMPORT
 */
import * as bcrypt from "bcrypt-nodejs";

import { Document, Schema, model } from "mongoose";

/**
 *
 */
export class User {

	public email    : string;
	public password : string;
	public profile  : {
		firstname   : string,
		lastname    : string,
	};
	public resetPasswordToken   : string;
	public resetPasswordExpires : Date;

	/**
	 *
	 * @param data
	 */
	constructor (data : { email : string, password : string, profile : { firstname : string, lastname : string } })
	{
		this.email    = data.email;
		this.password = data.password;
		this.profile  = data.profile;
	}

	/**
	 *
	 * @param candidatePassword
	 * @param cb
	 */
	public comparePassword (candidatePassword, cb) : void
	{
		bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
			if (err) {
				return cb(err);
			}

			cb(null, isMatch);
		});
	}

}

/*
 |      SCHEMA & METHODS
 */
let schema = new Schema({
	email                : {
		type      : String,
		lowercase : true,
		unique    : true,
		required  : true,
	},
	password             : {
		type     : String,
		required : true,
	},
	profile              : {
		firstname : { type : String },
		lastname  : { type : String },
	},
	resetPasswordToken   : { type : String },
	resetPasswordExpires : { type : Date },
});

schema.pre("save", function(next) {
	const user = this;
	const SALT_FACTOR = 5;

	if (!user.isModified("password")) { return next(); }

	bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
		if (err) { return next(err); }

		bcrypt.hash(user.password, salt, null, (err, hash) => {
			if (err) { return next(err); }

			user.password = hash;
			next();
		});
	});
});

schema.method("comparePassword", User.prototype.comparePassword);

/*
 |      USER DOCUMENT
 */
export interface UserDocument extends User, Document { }

/*
 |      USER MODEL
 */
export const Users = model<UserDocument>("user", schema);