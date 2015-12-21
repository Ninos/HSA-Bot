'use strict';

module.exports = {
	name: 'event',
	url: 'http://www.hs-augsburg.de/index.html',
	init: function () {
		this.hooks();

		return this;
	},
	hooks: function () {
		var that = this,
			api = require( '../lib/api.js' );

		api.event.addListener( 'message_' + this.name, function ( args ) {
			that.call( args );
		} );
	},
	call: function ( args ) {
		var that = this,
			api = require( '../lib/api.js' ),
			moment = require( 'moment' );

		// Get the data object from url/cache with all necessary event information
		that.getData( function ( error, data ) {
			if ( error ) {
				console.error( error );

				return;
			}

			// Check if new events exists
			if ( ! data ) {
				api.say( 'No events available' );

				return;
			}

			// Generate output content
			var content = [];
			Object.keys( data ).map( function ( key ) {
				var value = data[key],
					date = moment(
						value.date.from,
						'YYYY-MM-DD'
					).format( 'DD.MM.YYYY' );

				if ( value.date.to ) {
					date += ' - ' + moment(
							value.date.to,
							'YYYY-MM-DD'
						).format( 'DD.MM.YYYY' )
				}

				content.push( date + ': ' + value.title + ": " + value.hyperlink);
			} );

			api.say( args, content.join( "\n" ) );
		} );
	},
	getData: function ( callback ) {
		var that = this,
			cache = require( '../lib/cache.js' ),
			request = require( 'request' ),
			cheerio = require( 'cheerio' ),
			moment = require( 'moment' );

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
			if ( error || response.statusCode != 200 ) {
				callback( error );

				return;
			}

			var $ = cheerio.load( body );

			// Loop for every element with the classes content & keyword
			$( '#infosystems > a' ).each( function ( index ) {
				if ( ! $( this ).children( 'strong' ).length ) {
					return;
				}

				var date = $( this ).children( 'strong' ).text().split( '-' );

				// Write needed information as plain text in object
				data[index] = {
					title: $( this ).attr( 'title' ),
					hyperlink: "http://www.hs-augsburg.de/" + $( this ).attr( 'href' ),
					date: {
						from: moment(
							date[0].replace( '\n', '' ).trim(),
							'DD.MM.YYYY'
						).format( 'YYYY-MM-DD' ),
						to: date[1] !== undefined ? moment(
							date[1].replace( '\n', '' ).trim(),
							'DD.MM.YYYY'
						).format( 'YYYY-MM-DD' ) : null
					}
				};
			} );

			// Set the cache with an expire date of 3600 seconds
			cache.set( cacheName, 3600 );

			callback( null, data );
		} );
	}
};