/*
 |      IMPORTS
 */

import * as jwt from "jsonwebtoken";
import Router   from "../../shared/App/Router";

import { User, Users, UserDocument }       from "../Users/User";
import { Request, Response, NextFunction } from "express";


const config = require( "config" );
const crypto = require( "crypto" );

/**
 *
 */
export class AuthRouter extends Router {

	private JWT_EXPIRE_TIME : number = 10080;

	private ERR_USED        : string = "ERR_USED_EMAIL";
	private ERR_EMAIL       : string = "ERR_MISSING_EMAIL";
	private ERR_PASSWORD    : string = "ERR_MISSING_PASSWORD";
	private ERR_PROFILE     : string = "ERR_MISSING_FULLNAME";

	private _secret = config.get("passport.secret");

	/**
	 *
	 */
	constructor ()
	{
		super();

		this._routes();
	}

	/**
	 *
	 * @private
	 */
	private _routes () : void
	{
		this.router.post("/login",      this.login.bind(this));
		this.router.post("/register",   this.register.bind(this));
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
		return jwt.sign( user, this._secret, { expiresIn : this.JWT_EXPIRE_TIME });
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public login (req : Request, res : Response, next : NextFunction) : void
	{
		this.passport.authenticate("local", (err, user, info) => {

			if (err) { return next(err); }

			if (!user) { return res.status(401).json({ error : info.message }); }

			let userInfo = this._setUserInfo( user );
			let token    = this._generateToken( userInfo );

			res
				.status(200)
				.json({
						token : `JWT ${token}`,
						user  : userInfo,
					});

		})(req, res, next);
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public register (req : Request, res : Response, next : NextFunction) : Response
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
					profile  : { firstname : req.body.firstname, lastname : req.body.lastname },
				} );

				Users
					.create(registerUser, (err : any, user : UserDocument) => {
						if (err) { return next(err); }

						let userInfo = this._setUserInfo(user);
						let token    = this._generateToken(userInfo);

						res
							.status(201)
							.json({
								token : `JWT ${token}`,
								user  : userInfo,
							});
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
			email     : request.email,
			firstname : request.profile.firstname,
			lastname  : request.profile.lastname,
		};
	}
}

/*
 |      EXPORT
 */
export default new AuthRouter().router;