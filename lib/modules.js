'use strict';

module.exports = {
	path: {
		rel: '../modules/',
		abs: './modules/'
	},
	modules: {},
	init: function () {
		let fs = require( 'fs' ),
			files = fs.readdirSync( this.path.abs );

		for ( let i = 0; i < files.length; i ++ ) {
			let filename = files[i];

			if ( filename.substr( - 3 ) === '.js' ) {
				let module = require( this.path.rel + filename ).init();
				this.modules[module.name] = module;
			}
		}

		return this;
	},
	get: function () {
		return this.modules;
	}
};