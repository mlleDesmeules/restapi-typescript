/*
 |      IMPORT
 */

import { Passport }                            from "passport";
import { Strategy as LocalStrategy }           from "passport-local";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

import { Users, UserDocument }  from "../Users/User";

const config  = require( "config" );

/**
 *
 */
export default class Auth {

	private _secret : string = config.get("passport.secret");

	public localLogin;
	public jwtLogin;

	/**
	 *
	 */
	constructor (passport : Passport)
	{
		this._localLoginStrategy();
		this._jwtLoginStrategy();

		passport.use("local", this.localLogin);
		passport.use("jwt", this.jwtLogin);
	}

	/**
	 * @desc    Create a new local login strategy
	 *
	 * @private
	 */
	private _localLoginStrategy () : void
	{
		this.localLogin = new LocalStrategy({
			usernameField     : "email",
			passReqToCallback : true,
		}, (req : any, email : string, password : string, done : Function) => {

			Users
				.findOne({ email : email }, (err : any, user : UserDocument) => {

					/*
					 *  When searching for user, if an error occur, return it.
					 */
					if (err) { return done(err); }

					/*
					 *  If the user wasn't found, then return error message
					 */
					if (!user) { return done(null, false, { message : "USER_NOT_FOUND" }); }

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
						if (!isMatch) { return done(null, false, { message : "PWD_NOT_MATCH" }); }

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
		this.jwtLogin = new JwtStrategy({
			jwtFromRequest : ExtractJwt.fromAuthHeader(),
			secretOrKey    : this._secret,
		}, (payload : any, done : Function) => {

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