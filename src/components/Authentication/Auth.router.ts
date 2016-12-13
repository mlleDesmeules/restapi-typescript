/*
 |      IMPORTS
 */

import * as config   from "config";
import * as jwt      from "jsonwebtoken";
import * as passport from "passport";

import { Auth }                                    from "./Auth";
import { User, Users, UserDocument }               from "../Users/User";
import { Router, Request, Response, NextFunction } from "express";

const crypto = require( "crypto" );

/**
 *
 */
export class AuthRouter {

	private JWT_EXPIRE_TIME : number = 10080;

	private ERR_USED        : string = "ERR_USED_EMAIL";
	private ERR_EMAIL       : string = "ERR_MISSING_EMAIL";
	private ERR_PASSWORD    : string = "ERR_MISSING_PASSWORD";
	private ERR_PROFILE     : string = "ERR_MISSING_FULLNAME";

	private requireAuth;
	private requireLogin;

	public router : Router;

	constructor ()
	{
		this.router = Router();

		this.requireAuth  = passport.authenticate("jwt", { session : false });
		this.requireLogin = passport.authenticate("local", { session : false });

		this._routes();
	}

	/**
	 *
	 * @private
	 */
	private _routes () : void
	{
		this.router.post("/login",      this.requireLogin, this.login);
		this.router.post("/register",   this.register);
	}

	/**
	 *
	 * @param user
	 *
	 * @returns {string}
	 * @private
	 */
	private _generateToken ( user : Object )
	{
		return jwt.sign( user, config.get("passport.secret"), { expiresIn : this.JWT_EXPIRE_TIME });
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public login (req : Request, res : Response, next : NextFunction) : void
	{
		let UserInfo = this._setUserInfo( req.user );
		let token    = this._generateToken( UserInfo );

		res
			.status(200)
			.json({
					token : `JWT ${token}`,
					user  : UserInfo,
			      });
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public register (req : Request, res : Response, next : NextFunction) : void
	{
		/*
		 *  Return error if no email provided
		 */
		if (!req.body.email) { return res.status(422).json({ error : this.ERR_EMAIL }); }

		/*
		 *  Return error if no password provided
		 */
		if (!req.body.password) { return res.status(422).json({ error : this.ERR_PASSWORD }); }

		/*
		 *  Return error if no first name or last name provided
		 */
		if (!req.body.firstname || !req.body.lastname) { return res.status(422).json({ error : this.ERR_PROFILE }); }

		Users
			.findOne({ email : req.body.email }, (err : any, user : UserDocument) => {

				if (err) { return next(err); }

				if (user) { return res.status(422).json({ error : this.ERR_USED }); }

				/*
				 *  If the user email is unique and a password was provided, then create account.
				 */
				let registerUser = new User( {
					email    : req.body.email,
					password : req.body.password,
					profile  : { firstname : req.body.firstName, lastname : req.body.lastName }
				} );

				Users
					.save(registerUser, (err : any, user : UserDocument) => {
						if (err) { return next(err); }

						let UserInfo = this._setUserInfo(user);
						let token    = this._generateToken(UserInfo);
						
						res
							.status(201)
							.json({
									token : `JWT ${token}`,
									user  : UserInfo,
							      })
					});
			});
	}

	/**
	 *
	 *
	 * @param request
	 *
	 * @returns {*}
	 * @private
	 */
	private _setUserInfo ( request ) : Object
	{
		return {
			_id       : request._id,
			firstname : request.firstname,
			lastname  : request.lastname,
			email     : request.email,
		};
	}
}

/*
 |      EXPORT
 */
export default new AuthRouter().router;