/*
 *  Require Gulp Packages
 */
const gulp   = require( "gulp" );
const config = require( "./gulp.config" );
const $      = require( "gulp-load-plugins" )();

/*
 *  TypeScript project
 */
const tsProject = $.typescript.createProject("tsconfig.json");

/*
 *  Default tasks
 */
gulp.task("default", [ "watch" ]);
gulp.task("build", [ "build:ts" ]);

/*
 *  Watch tasks
 */
gulp.task("watch", [ "build:ts" ], () => {
	gulp.watch(config.ts_source, [ "build:ts" ]);
});

/*
 *  Build Tasks
 */
gulp.task("build:ts", () => {
	$.util.log("TypeScript --> Javascript");
	
	return tsProject
			.src()
			.pipe(tsProject())
			.js
			.pipe(gulp.dest(config.ts_dist));
});