'use strict';

let assert = require( 'assert' ),
	cache = require( '../lib/cache.js' );

describe( 'Cache', function () {
	describe( 'setter & getter', function () {
		it( 'should set the cache', function () {
			let key = 'key',
					value = 'Cached value',
					expire = 3600;

			cache.set( key, value, expire );

			assert.equal( value, cache.get( key ) );
		} );
	} );

	describe( 'expiration', function () {
		it( 'should return null', function () {
			let key = 'key',
					value = 'Cached value',
					expire = -1;

			cache.set( key, value, expire );

			assert.equal( null, cache.get( key ) );
		} );
	} );
} );
