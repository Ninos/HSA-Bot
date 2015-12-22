'use strict';

let api = require( '../lib/api.js' ),
	cache = require( '../lib/cache.js' ),
	request = require( 'request' ),
	cheerio = require( 'cheerio' ),
	moment = require( 'moment' );

module.exports = {
	name: 'event',
	description: 'This module returns the current events',
	help: [
		'No param needed'
	],
	url: 'http://www.hs-augsburg.de/index.html',
	init: function () {
		this.hooks();

		return this;
	},
	hooks: function () {
		let that = this;

		api.event.addListener( 'message_' + this.name, function ( args ) {
			that.call( args );
		} );
	},
	call: function ( args ) {
		let that = this;

		// Get the data object from url/cache with all necessary event information
		that.getData( function ( error, data ) {
			if ( error ) {
				api.say( args, error );

				return;
			}

			// Check if new events exists
			if ( ! data ) {
				api.say( args, new Error( 'No events available' ) );

				return;
			}

			// Generate output content
			let content = [];
			Object.keys( data ).map( function ( key ) {
				let value = data[key],
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

				content.push( date + ': ' + value.title + ' (' + value.link + ')' );
			} );

			api.say( args, content.join( "\n" ) );
		} );
	},
	getData: function ( callback ) {
		let that = this;

		// Return cache if exists and not expired
		let cacheName = that.name + '_data',
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
				callback( new Error( 'Unexpected response code', 'Connection status ' + response.statusCode + ': Expected response code 200' ) );

				return;
			}

			let $ = cheerio.load( body );

			// Loop for every element with the classes content & keyword
			$( '#infosystems > a' ).each( function ( index ) {
				if ( ! $( this ).children( 'strong' ).length ) {
					return;
				}

				let date = $( this ).children( 'strong' ).text().split( '-' );

				// Write needed information as plain text in object
				data[index] = {
					title: $( this ).attr( 'title' ),
					link: that.url.substring( 0, that.url.lastIndexOf( '/' ) ) + '/' + $( this ).attr( 'href' ),
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