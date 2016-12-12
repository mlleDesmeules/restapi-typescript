/*
 |      IMPORT
 */

import { expect, request } from "../../shared/Test.spec";
import { Todo, Todos, TodoDocument } from "./Todo";

let url = "/api/todo";

describe("Todo /api/todo", () => {

	beforeEach("Remove Todos", (done : Function) => {
		Todos
			.remove({}, (err) => {
				done();
			});
	});

	describe("GET /", () => {
		it("should GET all todo");
	});

	describe("GET /:id", () => {
		it("should GET a todo according to a specific ID");
		it("should return an error when wrong ID given");
	});

	describe("GET /author/:id", () => {
		it("should GET all todo created by a specific user");
		it("should return an error when wrong ID given");
	});

	describe("POST /", () => {
		it("should NOT create a todo without a title");
		it("should NOT create a todo without an author");
		it("should create a todo");
	});

	describe("PUT /:id", () => {
		it("should NOT update a todo without a title");
		it("should return an error when wrong ID given");
		it("should update a todo with given ID");
	});

	describe("DELETE /:id", () => {
		it("should return an error when wrong ID given");
		it("should DELETE a todo with given ID");
	});
});