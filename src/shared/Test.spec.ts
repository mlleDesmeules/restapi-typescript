/*
 |      This is the list of default imports needed for any test files.
 */

process.env.NODE_ENV = "test";

/*
 |      IMPORTS
 */

import * as mocha     from "mocha";
import * as chai      from "chai";
import * as mongoose  from "mongoose";
import * as supertest from "supertest";

const mockgoose = require( "mockgoose" )(mongoose);

import Server from "../Server";

/*
 |      EXPORTS
 */
export let expect  = chai.expect;
export let request = supertest(Server);