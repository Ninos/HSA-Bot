'use strict';

let assert = require( 'assert' ),
	api = require( '../lib/api.js' ),
	modules = require( '../lib/modules.js' );

describe( 'Modules', function () {
	describe( 'init()', function () {
		it( 'should load all modules', function () {
			let help = require( '../modules/help.js' );

			api.init();
			modules.init();

			assert.deepEqual( help, modules.get( 'help' ) );
			assert.deepEqual( modules.get(), modules.get( 'noModule' ) );
		} );
	} );
} );
