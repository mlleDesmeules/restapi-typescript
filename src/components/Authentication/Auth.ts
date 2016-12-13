/*
 |      IMPORT
 */

import * as config              from "config";
import * as passport            from "passport";
import * as localStrategy       from "passport-local";

import { ExtractJwt, Strategy } from "passport-jwt";
import { Users, UserDocument }  from "../Users/User";

/**
 *
 */
export default class Auth {

	/**
	 *
	 * @type {{usernameField: string}}
	 */
	private localOpt = { usernameField : 'email' };

	/**
	 *
	 * @type {{jwtFromRequest: JwtFromRequestFunction, secretOrKey: T}}
	 */
	private jwtOpt   = {
		jwtFromRequest : ExtractJwt.fromAuthHeader(),
		secretOrKey    : config.get("passport.secret")
	};

	/**
	 *
	 */
	public localLogin : localStrategy;

	/**
	 *
	 */
	public jwtLogin   : ExtractJwt;

	/**
	 *
	 */
	constructor ()
	{
		this._localLoginStrategy();
		this._jwtLoginStrategy();

		passport.use(this.localLogin);
		passport.use(this.jwtLogin);
	}

	/**
	 * @desc    Create a new local login strategy
	 *
	 * @private
	 */
	private _localLoginStrategy () : void
	{
		this.localLogin = new localStrategy(this.localOpt, (email : string, password : string, done : Function) => {

			Users
				.findOne({ email }, (err : any, user : UserDocument) => {

					/*
					 *  When searching for user, if an error occur, return it.
					 */
					if (err) { return done(err); }

					/*
					 *  If the user wasn't found, then return error message
					 */
					if (!user) { return done(null, false, { error : "USER_NOT_FOUND" }); }

					/*
					 *  Verify if the password match
					 */
					user.comparePassword(password, (err, isMatch) => {
						/*
						 *  if an error occurred, then return it
						 */
						if (err) { return done(err); }
						
						/*
						 *  if the password doesn't match, then return error
						 */
						if (!isMatch) { return done(null, false, { error : "PWD_NOT_MATCH" }); }

						/*
						 *  return the user in case of correct login
						 */
						return done(null, user);
					});
				});

		});
	}

	/**
	 * @desc    Create a new JWT login strategy
	 *
	 * @private
	 */
	private _jwtLoginStrategy () : void
	{
		this.jwtLogin = new Strategy(this.jwtOpt, (payload : any, done : Function) => {

			Users
				.findById(payload._id, (err : any, user : UserDocument) => {

					/*
					 *  When searching for user, if an error occur, return it.
					 */
					if (err) { return done(err); }

					/*
					 *  if user wasn't found
					 */
					if (!user) { return done(null, false); }

					/*
					 *  if user was found
					 */
					return done(null, user);
				});

		});
	}
}