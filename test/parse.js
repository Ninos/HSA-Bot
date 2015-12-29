'use strict';

let assert = require( 'assert' ),
	parse = require( '../lib/parse.js' );

describe( 'Parse', function () {
	describe( 'parse()', function () {
		it( 'should split string into arguments', function () {
			let parsed = parse.parse( 'HSA-Bot module arg1 arg2' );

			assert.deepEqual( parsed, ['HSA-Bot', 'module', 'arg1', 'arg2'] );
		} );
	} );

	describe( 'message()', function () {
		it( 'should return parsed string as correct message object', function () {
			let args = parse.message( 'HSA-Bot module arg1 arg2' );

			assert.deepEqual( args, {
				mention: 'HSA-Bot',
				module: 'module',
				param: ['arg1', 'arg2']
			} );
		} );
	} );

	describe( 'pm()', function () {
		it( 'should return parsed string as correct pm object', function () {
			let args = parse.pm( 'module arg1 arg2' );

			assert.deepEqual( args, {
				module: 'module',
				param: ['arg1', 'arg2']
			} );
		} );
	} );

	describe( 'isMentioned()', function () {
		it( 'should return true if bot is mentioned, else false', function () {
			let args = parse.message( 'module arg1 arg2' );

			assert.equal( true, parse.isMentioned( 'HSA-Bot', 'HSA-Bot' ) );
			assert.equal( true, parse.isMentioned( 'HSA-Bot', 'hsa-bot' ) );
			assert.equal( true, parse.isMentioned( 'HSA-Bot', 'HSABot' ) );
			assert.equal( true, parse.isMentioned( 'HSA-Bot', 'hsabot' ) );
			assert.equal( true, parse.isMentioned( 'HSA-Bot', '@HSA-Bot' ) );
			assert.equal( true, parse.isMentioned( 'HSA-Bot', '@hsa-bot' ) );
			assert.equal( true, parse.isMentioned( 'HSA-Bot', '@HSABot' ) );
			assert.equal( true, parse.isMentioned( 'HSA-Bot', '@hsabot' ) );

			assert.equal( false, parse.isMentioned( 'HSA-Bot', 'HS-Bot' ) );
			assert.equal( false, parse.isMentioned( 'HSA-Bot', 'hs-bot' ) );
			assert.equal( false, parse.isMentioned( 'HSA-Bot', 'HSBot' ) );
			assert.equal( false, parse.isMentioned( 'HSA-Bot', 'hsbot' ) );
			assert.equal( false, parse.isMentioned( 'HSA-Bot', 'hsa' ) );
			assert.equal( false, parse.isMentioned( 'HSA-Bot', 'bot' ) );
			assert.equal( false, parse.isMentioned( 'HSA-Bot', 'test' ) );
		} );
	} );
} );
