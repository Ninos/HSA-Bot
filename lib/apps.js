'use strict';

module.exports = {
	path: {
		rel: '../apps/',
		abs: './apps/'
	},
	apps: {},
	init: function () {
		var fs = require( 'fs' ),
			files = fs.readdirSync( this.path.abs );

		for ( var i = 0; i < files.length; i ++ ) {
			var filename = files[i];

			if ( filename.substr( - 3 ) === '.js' ) {
				var app = require( this.path.rel + filename ).init();
				this.apps[app.name] = app;
			}
		}

		return this;
	},
	get: function () {
		return this.apps;
	}
};