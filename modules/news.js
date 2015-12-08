'use strict';

module.exports = {
	name: 'news',
	url: 'http://www.hs-augsburg.de/index.html',
	init: function () {
		this.hooks();

		return this;
	},
	hooks: function () {
		var that = this,
			api = require( '../lib/api.js' );

		api.event.addListener( 'message_' + this.name, function ( args ) {
			// Get the data object from url/cache with all necessary news information
			that.getData( function ( data ) {

				// Check if new news exists
				if ( ! data ) {
					api.say( 'No news available' );

					return;
				}

				// Generate output content
				var content = [];
				Object.keys( data ).map( function ( key ) {
					var value = data[key];

					content.push( value.title );
				} );

				api.say( args, content.join( "\n" ) );
			} );
		} );
	},
	getData: function ( callback ) {
		var that = this,
			cache = require( '../lib/cache.js' ),
			request = require( 'request' ),
			cheerio = require( 'cheerio' );

		// Return cache if exists and not expired
		var data = cache.get( that.name + '_data_news' );
		if ( data ) {
			callback( data );

			return;
		}

		data = {};

		// Get html, parse and return object
		request( this.url, function ( error, response, body ) {
			if ( error || response.statusCode != 200 ) {
				console.log( 'Connection error' );

				return;
			}

			var $ = cheerio.load( body );

			// Loop for every element with the classes content & keyword
			$( '#content .px131' ).each( function ( index ) {
				// Write needed information as plain text in object
				data[index] = {
					title: $( this ).find( 'h3' ).text().trim()
				};
			} );

			// Set the cache with an expire date of 3600 seconds
			cache.set( that.name + '_data_news', data, 3600 );

			callback( data );
		} );
	}
};