'use strict';

let config = require( '../config.js' ),
	api = require( '../lib/api.js' ),
	parse = require( '../lib/parse.js' ),
	irc = require( 'irc' );

module.exports = {
	client: null,
	init: function () {
		this.connect();
		this.hooks();

		return this;
	},
	connect: function () {
		this.client = new irc.Client( config.irc.server, config.irc.name, {
			channels: config.irc.channels,
		} );
	},
	hooks: function () {
		let that = this;

		this.client.addListener( 'message', function ( from, to, message ) {
			let args = parse.message( message ),
				mention = args.mention,
				module = args.module,
				param = args.param;

			if ( ! parse.isMentioned( mention, config.irc.name ) ) {
				return;
			}

			api.message( {
				'module': module,
				'param': param,
				'from': from,
				'to': to,
				'pm': false
			} );
		} );

		this.client.addListener( 'pm', function ( from, message ) {
			let args = parse.pm( message ),
				module = args.module,
				param = args.param;

			api.message( {
				'module': module,
				'param': param,
				'from': from,
				'to': from,
				'pm': true
			} );
		} );

		this.client.addListener( 'error', function ( message ) {
			return message;
		} );

		api.event.addListener( 'say', function ( args, content ) {
			if ( ! args.pm && args.from ) {
				content = '@' + args.from + "\n" + content;
			}

			that.client.say( args.to, content );
		} );
	}
};