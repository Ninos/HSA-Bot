'use strict';

module.exports = {
	path: {
		rel: '../modules/',
		abs: './modules/'
	},
	modules: {},
	init: function () {
		var fs = require( 'fs' ),
			files = fs.readdirSync( this.path.abs );

		for ( var i = 0; i < files.length; i ++ ) {
			var filename = files[i];

			if ( filename.substr( - 3 ) === '.js' ) {
				var module = require( this.path.rel + filename ).init();
				this.modules[module.name] = module;
			}
		}

		return this;
	},
	get: function () {
		return this.modules;
	}
};