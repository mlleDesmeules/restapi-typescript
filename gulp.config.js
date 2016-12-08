module.exports = function () {

	var root   = "./";
	var source = "src/";
	var dist   = "dist/";

	/*
	 *  config to be returned
	 */
	var config = {
		
		source : source,

		ts_source : source + "**/*.ts",
		ts_dist   : dist,
		
	};

	//  return config object
	return config;
}();