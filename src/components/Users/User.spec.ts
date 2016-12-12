/*
 |      IMPORTS
 */

import { expect, request } from "../../shared/Test.spec";
import { User, Users, UserDocument } from "./User";

let url    = "/api/user";

describe("User /api/user", () => {

	beforeEach("Remove Users", (done : Function) => {
		Users
			.remove({}, (err) => {
				done()
			});
	});

	describe("GET /", () => {
		it("should GET the user list", (done) => {
			request
				.get(url)
				.expect(200)
				.expect((res : any) => {
					expect(res.body).to.be.an("array");
				})
				.end(done);
		});
	});

	describe("GET /:id", () => {

		let savedUser;

		beforeEach("create user to get", (done : Function) => {
			/*
			 *  Define new user object
			                           */
			let myUser = new User({
				email    : "roxanne.desmeules@gmail.com",
				password : "aaa111",
				profile  : {
					firstname : "Roxanne",
					lastname  : "Desmeules",
				}
			});

			/*
			 *  Create new user in database
			 */
			Users
				.create(myUser, (err : any, doc : UserDocument) => {
					savedUser = doc;
					done();
				});
		});

		it("should GET a user according to a specific ID", (done) => {
			request
				.get(url + "/" + savedUser.id)
				.expect(200)
				.expect((res : any) => {
					expect(res.body).to.be.an("object");

					expect(res.body).to.have.property("email");
					expect(res.body).to.have.property("profile").to.be.an("object");
					expect(res.body.profile).to.have.property("firstname");
					expect(res.body.profile).to.have.property("lastname");

					expect(res.body).to.not.have.property("password");
				})
				.end(done);
		});

		it("should return an error when wrong ID given", (done) => {
			request
				.get(url + "/wrongid")
				.expect(400)
				.expect((res : any) => {
					expect(res.body).to.be.an("object");
					expect(res.body).to.have.property("message");
				})
				.end(done);
		});
	});

	describe("POST /", () => {
		it("should NOT create a user without an email", (done) => {
			let body = {
				password : "aaa111",
				firstname: "Roxanne",
				lastname : "Desmeules",
			};

			request
				.post(url)
				.send(body)
				.expect(400)
				.expect((res : any) => {
					expect(res.body).to.be.an("object");
					expect(res.body).to.have.property("errors");
					expect(res.body.errors).to.have.property("email");
				})
				.end(done);
		});

		it("should NOT create a user without a password", (done) => {
			let body = {
				email    : "roxanne.desmeules@gmail.com",
				firstname: "Roxanne",
				lastname : "Desmeules",
			};

			request
				.post(url)
				.send(body)
				.expect(400)
				.expect((res : any) => {
					expect(res.body).to.be.an("object");
					expect(res.body).to.have.property("errors");
					expect(res.body.errors).to.have.property("password");
				})
				.end(done);
		});

		it("should CREATE a user", (done) => {
			let body = {
				email    : "roxanne.desmeules@gmail.com",
				password : "aaa111",
				firstname: "Roxanne",
				lastname : "Desmeules",
			};

			request
				.post(url)
				.send(body)
				.expect(200)
				.expect((res : any) => {
					expect(res.body).to.be.an("object");

					expect(res.body).to.have.property("email");
					expect(res.body).to.have.property("profile");
					expect(res.body.profile).to.be.an("object");
					expect(res.body.profile).to.have.property("firstname");
					expect(res.body.profile).to.have.property("lastname");

					expect(res.body).to.not.have.property("password");
				})
				.end(done);
		});
	});

	describe("PUT /:id", () => {
		// it("should NOT update a user without an email");
		// it("should NOT update a user without a password");

		// it("should return an error when wrong ID given");

		// it("should UPDATE a user with given ID");
	});

	describe("DELETE /:id", () => {
		// it("should return an error when wrong ID given");
		// it("should DELETE a user with given ID");
	});
});