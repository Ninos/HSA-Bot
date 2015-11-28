'use strict';

module.exports = {
	root: null,
	client: null,
	init: function ( root ) {
		this.root = root;

		this.connect();
		this.hooks();

		return this;
	},
	connect: function () {
		var config = this.root.config,
			irc = require( 'irc' );

		this.client = new irc.Client( config.irc.server, config.irc.name, {
			channels: config.irc.channels,
		} );
	},
	hooks: function () {
		var that = this,
			api = this.root.lib.api,
			parse = this.root.lib.parse;

		this.client.addListener( 'message', function ( from, to, message ) {
			var args = parse.message( message ),
				mention = args.mention,
				module = args.module,
				param = args.param;

			if ( ! that.isMentioned( mention ) ) {
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
			var args = parse.pm( message ),
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
			that.client.say( args.to, content );
		} );
	},
	isMentioned: function ( mention ) {
		var config = this.root.config,
			mention = mention.toLowerCase(),
			name = config.irc.name.toLowerCase();

		if (
			mention == name
			|| mention.replace( /\W/g, '' ) == name.replace( /\W/g, '' )
		) {
			return true;
		}

		if (
			mention == '@' + name
			|| mention.replace( /\W/g, '' ) == '@' + name.replace( /\W/g, '' )
		) {
			return true;
		}

		return false;
	}
};