/*
 |      IMPORT
 */

import { expect, request } from "../../shared/imports/Test.spec";
import { User, Users, UserDocument } from "../Users/User";

let url = "/api/auth";

describe("Authentication /api/auth", () => {

	beforeEach("clean up database", (done : Function) => {
		Users
			.remove({}, (err : any) => {
				done();
			});
	});

	describe("/register", () => {
		it("should NOT register a new user without an email", (done) => {
			let body = { password : "aaa111", firstname: "Roxanne", lastname : "Desmeules", };

			request
				.post(`${url}/register`)
				.send(body)
				.expect(422)
				.expect((res : any) => {
					expect(res.body).to.be.an("object");
					expect(res.body).to.have.property("error");

					expect(res.body.error).to.eql("ERR_MISSING_EMAIL");
				})
				.end(done);
		});

		it("should NOT register a new user without a password", (done) => {
			let body = { email : "roxanne.desmeules@gmail.com", firstname: "Roxanne", lastname : "Desmeules", };

			request
				.post(`${url}/register`)
				.send(body)
				.expect(422)
				.expect((res : any) => {
					expect(res.body).to.be.an("object");
					expect(res.body).to.have.property("error");

					expect(res.body.error).to.eql("ERR_MISSING_PASSWORD");
				})
				.end(done);
		});

		it("should NOT register a new user without a full name", (done) => {
			let body = { email : "roxanne.desmeules@gmail.com", password : "aaa111", lastname : "Desmeules", };

			request
				.post(`${url}/register`)
				.send(body)
				.expect(422)
				.expect((res : any) => {
					expect(res.body).to.be.an("object");
					expect(res.body).to.have.property("error");

					expect(res.body.error).to.eql("ERR_MISSING_FULLNAME");
				})
				.end(done);
		});

		it("should NOT register a new user with an existing email", (done) => {
			/*
			 *  Define new user object
			 */
			let myUser = new User({
				email    : "roxanne.desmeules@gmail.com",
				password : "aaa111",
				profile  : {
					firstname : "Roxanne",
					lastname  : "Desmeules",
				},
			});

			/*
			 *  Create new user in database
			 */
			Users
				.create(myUser, (err : any, doc : UserDocument) => { });

			/*
			 *  Create body that will be used for the registration process
			 */
			let body = { email : "roxanne.desmeules@gmail.com", password : "aaa111", firstname : "Roxanne", lastname : "Desmeules", };

			request
				.post(`${url}/register`)
				.send(body)
				.expect(422)
				.expect((res : any) => {
					expect(res.body).to.be.an("object");
					expect(res.body).to.have.property("error");

					expect(res.body.error).to.be.eql("ERR_USED_EMAIL")
				})
				.end(done);

		});

		it("should register a new user", (done) => {
			let body = { email : "roxanne.desmeules@gmail.com", password : "aaa111", firstname : "Roxanne", lastname : "Desmeules", };

			request
				.post(`${url}/register`)
				.send(body)
				.expect(201)
				.expect((res : any) => {
					expect(res.body).to.be.an("object");

					expect(res.body).to.have.property("token");
					expect(res.body).to.have.property("user");

					expect(res.body.token).to.match(/^JWT/);

					expect(res.body.user).to.have.property("_id");
					expect(res.body.user).to.have.property("email");
					expect(res.body.user).to.have.property("firstname");
					expect(res.body.user).to.have.property("lastname");
				})
				.end(done);
		});
	});

	describe("/login", () => {
		beforeEach("create user", (done : Function) => {
			/*
			 *  Define new user object
			                           */
			let myUser = new User({
				email    : "roxanne.desmeules@gmail.com",
				password : "aaa111",
				profile  : {
					firstname : "Roxanne",
					lastname  : "Desmeules",
				},
			});

			/*
			 *  Create new user in database
			 */
			Users
				.create(myUser, (err : any, doc : UserDocument) => { done(); });
		});

		it("should NOT log a user in without an existing email", (done) => {
			let body = { email : "test@test.com", password : "aaa111" };

			request
				.post(`${url}/login`)
				.send(body)
				.expect(401)
				.expect((res : any) => {
					expect(res.body).to.be.an("object");
					expect(res.body).to.have.property("error");
					expect(res.body.error).to.eql("USER_NOT_FOUND");
				})
				.end(done);
		});

		it("should NOT log a user in with the wrong email/password combination", (done) => {
			let body = { email : "roxanne.desmeules@gmail.com", password : "aaa222" };

			request
				.post(`${url}/login`)
				.send(body)
				.expect(401)
				.expect((res : any) => {
					expect(res.body).to.be.an("object");
					expect(res.body).to.have.property("error");
					expect(res.body.error).to.eql("PWD_NOT_MATCH");
				})
				.end(done);
		});

		it("should log a user in", (done) => {
			let body = { email : "roxanne.desmeules@gmail.com", password : "aaa111" };

			request
				.post(`${url}/login`)
				.send(body)
				.expect(200)
				.expect((res : any) => {
					expect(res.body).to.be.an("object");
					
					expect(res.body).to.have.property("token");
					expect(res.body).to.have.property("user");
					
					expect(res.body.token).to.match(/^JWT/);
					
					expect(res.body.user).to.have.property("_id");
					expect(res.body.user).to.have.property("email");
					expect(res.body.user).to.have.property("firstname");
					expect(res.body.user).to.have.property("lastname");
				})
				.end(done);
		});
	});
});
