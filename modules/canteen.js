'use strict';

module.exports = {
	name: 'mensa',
	root: null,
	url: {
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
		this.loadData( 'aug_friedbergerstr_fh' );

		return this;
	},
	hooks: function () {
		var that = this;

		var api = this.root.lib.api;

		api.event.addListener( 'message_' + this.name, function ( args ) {

		} );
	},
	loadData: function ( canteen ) {
		var that = this;

		var request = require( 'request' ),
			cheerio = require( 'cheerio' ),
			moment = require( 'moment' );

		if ( ! that.isValidCanteen( canteen ) ) {
			return;
		}

		var data = {};

		request( this.url.details + canteen, function ( error, response, body ) {
			if ( error || response.statusCode != 200 ) {
				console.log( 'Connection error' );

				return;
			}

			var $ = cheerio.load( body );

			$( '.page.details' ).each( function () {
				var id = $( this ).attr( 'id' ).split( '_' ).pop();
				var date = moment(
					$( this ).find( '[data-role="header"] .essendetail' ).text().split( ', ' ).pop(),
					'DD.MM.YYYY'
				).format( 'YYYY-MM-DD' );

				if ( ! data[date] ) {
					data[date] = {};
				}

				data[date][id] = {
					title: $( this ).find( '[data-role="content"] h4' ).text().replace( /\u00AD/g, '' ),
					heading: $( this ).find( '[data-role="content"] h4' ).next().text().replace( /\u00AD/g, '' ),
					description: $( this ).find( '[data-role="content"] h4' ).next().next().text().replace( /\u00AD/g, '' ),
				};
			} );

			console.log( data );
		} );
	},
	isValidCanteen: function ( canteen ) {
		return this.canteens.indexOf( canteen );
	}
};