'use strict';

module.exports = {
	path: {
		rel: '../apps/',
		abs: './apps/'
	},
	apps: {},
	init: function () {
		let fs = require( 'fs' ),
			files = fs.readdirSync( this.path.abs );

		for ( let i = 0; i < files.length; i ++ ) {
			let filename = files[i];

			if ( filename.substr( - 3 ) === '.js' ) {
				let app = require( this.path.rel + filename ).init();
				this.apps[app.name] = app;
			}
		}

		return this;
	},
	get: function () {
		return this.apps;
	}
};