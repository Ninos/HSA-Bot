'use strict';

module.exports = {
	name: 'canteen',
	root: null,
	url: {
		canteens: 'http://augsburg.my-mensa.de/chooser.php?v=4828283&hyp=1&lang=de&mensa=all',
		details: 'http://augsburg.my-mensa.de/details.php?v=4828271&hyp=1&lang=de&mensa='
	},
	canteens: [
		'aug_universitaetsstr_uni',
		'aug_friedbergerstr_fh',
		'aug_baumgartner_fh',
		'neuulm_wiley_fh',
		'neuulm_steubenstr',
		'kempten_fh'
	],
	init: function ( root ) {
		this.root = root;

		this.hooks();

		return this;
	},
	hooks: function () {
		var that = this,
			api = this.root.lib.api,
			parse = this.root.lib.parse;

		api.event.addListener( 'message_' + this.name, function ( args ) {
			// Check if param 1 is not empty and a valid canteen
			if ( args.param[0] == undefined || args.param[0] == '' || ! that.isValidCanteen( args.param[0] ) ) {
				return;
			}

			// Check if param 2 is not empty (should be a date)
			if ( args.param[1] == undefined || args.param[1] == '' ) {
				return;
			}

			// Get the data object from url/cache with all nessessary menu informations
			that.getData( args.param[0], function ( data ) {
				// Format the input date
				var date = parse.date( args.param[1], 'YYYY-MM-DD' );

				// Check if a menu exists for the inputted date
				if ( ! data[date] ) {
					api.say( args, 'Sorry, for that date a menu does not exists!' );

					return;
				}

				// Generate output content
				var content = [];
				Object.keys( data[date] ).map( function ( key ) {
					var value = data[date][key];

					content.push( value.title + ': ' + value.heading + ' ' + value.description );
				} );

				api.say( args, content.join( "\n" ) );
			} );
		} );
	},
	getData: function ( canteen, callback ) {
		var that = this,
			cache = this.root.lib.cache,
			request = require( 'request' ),
			cheerio = require( 'cheerio' ),
			moment = require( 'moment' );

		if ( ! that.isValidCanteen( canteen ) ) {
			return;
		}

		// Return cache if exists and not expired
		var data = cache.get( that.name + '_data_' + canteen );
		if ( data ) {
			callback( data );

			return;
		}

		data = {};

		// Get html, parse and return object
		request( this.url.details + canteen, function ( error, response, body ) {
			if ( error || response.statusCode != 200 ) {
				console.log( 'Connection error' );

				return;
			}

			var $ = cheerio.load( body );

			// Loop for every element with the classes page & details
			$( '.page.details' ).each( function () {
				// Get the menu id and parse the date into well formatted string
				var id = $( this ).attr( 'id' ).split( '_' ).pop();
				var date = moment(
					$( this ).find( '[data-role="header"] .essendetail' ).text().split( ', ' ).pop(),
					'DD.MM.YYYY'
				).format( 'YYYY-MM-DD' );

				// Create second level only, if date data is not initialized
				if ( ! data[date] ) {
					data[date] = {};
				}

				// Write needed informations as paint text in object
				data[date][id] = {
					title: $( this ).find( '[data-role="content"] h4' ).text().replace( /\u00AD/g, '' ).trim(),
					heading: $( this ).find( '[data-role="content"] h4' ).next().text().replace( /\u00AD/g, '' ).trim(),
					description: $( this ).find( '[data-role="content"] h4' ).next().next().text().replace( /\u00AD/g, '' ).trim()
				};
			} );

			// Set the cache with an expire date of 3600 seconds
			cache.set( that.name + '_data_' + canteen, data, 3600 );

			callback( data );
		} );
	},
	isValidCanteen: function ( canteen ) {
		return (
			this.canteens.indexOf( canteen ) != - 1
		);
	}
};