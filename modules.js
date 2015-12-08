'use strict';

module.exports = {
	modules: {},
	init: function () {
		var fs = require( 'fs' ),
			path = './modules/',
			files = fs.readdirSync( path );

		for ( var i = 0; i < files.length; i ++ ) {
			var filename = files[i];

			if ( filename.substr( - 3 ) === '.js' ) {
				var module = require( path + filename ).init();
				this.modules[module.name] = module;
			}
		}

		return this;
	},
	get: function () {
		return this.modules;
	}
};