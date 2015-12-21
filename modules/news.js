'use strict';

var api = require( '../lib/api.js' ),
	cache = require( '../lib/cache.js' ),
	request = require( 'request' ),
	cheerio = require( 'cheerio' );

module.exports = {
	name: 'news',
	url: 'http://www.hs-augsburg.de/index.html',
	init: function () {
		this.hooks();

		return this;
	},
	hooks: function () {
		var that = this;

		api.event.addListener( 'message_' + this.name, function ( args ) {
			that.call( args );
		} );
	},
	call: function ( args ) {
		var that = this;

		// Get the data object from url/cache with all necessary news information
		that.getData( function ( error, data ) {
			if ( error ) {
				console.error( error );

				return;
			}

			// Check if new news exists
			if ( ! data ) {
				api.say( 'No news available' );

				return;
			}

			// Generate output content
			var content = [];
			Object.keys( data ).map( function ( key ) {
				var value = data[key];
				content.push( value.title + ' (' + value.link + ')' );
			} );

			api.say( args, content.join( "\n" ) );
		} );
	},
	getData: function ( callback ) {
		var that = this;

		// Return cache if exists and not expired
		var cacheName = that.name + '_data',
			data = cache.get( cacheName );
		if ( data ) {
			setImmediate( callback, null, data );

			return;
		}

		data = {};

		// Get html, parse and return object
		request( this.url, function ( error, response, body ) {
			if ( error ) {
				callback( error );

				return;
			}

			if ( response.statusCode != 200 ) {
				callback( new Error( 'Connection status ' + response.statusCode + ': Expected response code 200' ) );

				return;
			}

			var $ = cheerio.load( body );

			// Loop for every element with the classes content & keyword
			$( '#content .px131' ).each( function ( index ) {
				// Write needed information as plain text in object
				data[index] = {
					title: $( this ).find( 'h3' ).text().trim(),
					link: that.url.substring( 0, that.url.lastIndexOf( '/' ) ) + '/' + $( this ).find( 'a' ).attr( 'href' )
				};
			} );

			// Set the cache with an expire date of 3600 seconds
			cache.set( cacheName, data, 3600 );

			callback( null, data );
		} );
	}
};