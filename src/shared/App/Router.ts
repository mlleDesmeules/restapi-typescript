/*
 |      IMPORTS
 */

import * as passport from "passport";

import Auth       from "../../components/Authentication/Auth";
import { Router as ERouter } from "express";

/**
 * @class AppRouter
 */
export default class Router {

	private _requireAuthOpt  = { session : false, failureFlash : true };
	private _requireLoginOpt = { session : false, failureFlash : true };

	public passport : passport.Passport;

	public requireAuth ;
	public requireLogin;

	public router : ERouter;

	/**
	 *
	 */
	constructor ()
	{
		/*
		 *  Declare router
		 */
		this.router = ERouter();

		this._authentication();
	}

	/**
	 * @desc    This function will create a new Auth instance that will configure EVERY strategies used by the passport
	 *          package.
	 *
	 * @private
	 */
	private _authentication () : void
	{
		this.passport = passport;

		new Auth(this.passport);

		this.requireAuth  = this.passport.authenticate("jwt", this._requireAuthOpt);
		this.requireLogin = this.passport.authenticate("local", this._requireLoginOpt);
	}

}