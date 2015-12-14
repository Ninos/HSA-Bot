'use strict';

module.exports = {
	name: 'schedule',
	url: 'https://melpomene.webuntis.com/WebUntis/Timetable.do?school=HS-Augsburg',
	urlParam: {
		config: {
			'ajaxCommand': 'getPageConfig',
			'departmentId': 5,
			'filter.departmentId': 5,
			'formatId': 7,
			'type': 1
		},
		weekly: {
			'ajaxCommand': 'getWeeklyTimetable',
			'departmentId': 5,
			'filter.departmentId': 5,
			'formatId': 7,
			'type': 1,
			'date': '{date}',
			'elementID': '{ID}'
		}
	},
	init: function () {
		this.hooks();

		return this;
	},
	hooks: function () {
		var that = this,
			api = require( '../lib/api.js' );

		// DevMode start
		/*
		var args = {
			param: ['I-IN3', '14.12.2015']
		};
		that.call( args );
		*/
		// DevMode end

		api.event.addListener( 'message_' + this.name, function ( args ) {
			that.call( args );
		} );
	},
	call: function ( args ) {
		var that = this,
			api = require( '../lib/api.js' ),
			parse = require( '../lib/parse.js' );

		// Check if param 1 is not empty (should be semester)
		if ( args.param[0] == undefined || args.param[0] == '' ) {
			return;
		}

		// Check if param 2 is not empty (should be a date)
		if ( args.param[1] == undefined || args.param[1] == '' ) {
			return;
		}

		// Format the input date
		var date = parse.date( args.param[1], 'YYYYMMDD' );

		// Get the data object from url/cache with all nessessary configurations
		this.getConfig( function ( error, data ) {
			if ( error ) {
				console.error( error );

				return;
			}

			var id = null;
			data.every( function ( value ) {
				if ( args.param[0] == value.name ) {
					id = value.id;

					return false;
				}

				return true;
			} );

			// Check if semester was found
			if ( ! id ) {
				api.say( args, 'Sorry, semester not found!' );

				return;
			}

			// Get the data object from url/cache with all nessessary menu informations
			that.getData( {id: id, date: date}, function ( error, data ) {
				if ( error ) {
					console.error( error );

					return;
				}

				// Generate output content
				var content = [];
				Object.keys( data ).map( function ( key ) {
					var value = data[key];

					content.push( value.title + ': ' + value.heading + ' ' + value.description );
				} );

				api.say( args, content.join( "\n" ) );
			} );
		} );
	},
	getConfig: function ( callback ) {
		var that = this,
			cache = require( '../lib/cache.js' ),
			request = require( 'request' );

		// Return cache if exists and not expired
		var cacheName = that.name + '_data_config',
			data = cache.get( cacheName );
		if ( data ) {
			setImmediate( callback, null, data );

			return;
		}

		// Get json and return object
		request.post( {
			url: that.url,
			form: that.urlParam.config,
			json: true
		}, function ( error, response, body ) {
			if ( error || response.statusCode != 200 ) {
				callback( error );

				return;
			}

			data = body.elements;

			// Set the cache with an expire date of 3600 seconds
			cache.set( cacheName, data, 3600 );

			callback( null, data );
		} );
	},
	getData: function ( args, callback ) {
		var that = this,
			cache = require( '../lib/cache.js' ),
			request = require( 'request' );

		// Return cache if exists and not expired
		var cacheName = that.name + '_data_' + args.id + '_' + args.date,
			data = cache.get( cacheName );
		if ( data ) {
			setImmediate( callback, null, data );

			return;
		}

		data = {};

		// Get json and return object
		request.post( {
			url: that.url,
			form: that.urlParam.config,
			json: true
		}, function ( error, response, body ) {
			if ( error || response.statusCode != 200 ) {
				callback( error );

				return;
			}

			data = body.elements;

			// Set the cache with an expire date of 3600 seconds
			cache.set( cacheName, data, 3600 );

			callback( null, data );
		} );
	}
};