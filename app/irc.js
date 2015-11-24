'use strict';

module.exports = {
	global: {},
	client: null,
	init: function ( param ) {
		this.global = param;

		this.connect();
		this.listener();

		return this;
	},
	connect: function () {
		var irc = require( 'irc' );

		var config = this.global.config;

		this.client = new irc.Client( config.irc.server, config.irc.name, {
			channels: config.irc.channels,
		} );
	},
	listener: function () {
		var that = this;

		var api = this.global.api;
		var parse = this.global.parse;

		this.client.addListener( 'message', function ( from, to, message ) {
			var args = parse.message( message );
			var mention = args.mention;
			var module = args.module;
			var param = args.param;

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
			var args = parse.pm( message );
			var module = args.module;
			var param = args.param;

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

		api.event.on( 'say', function ( args, content ) {
			that.client.say( args.to, content );
		} );
	},
	isMentioned: function ( mention ) {
		var config = this.global.config;

		var mention = mention.toLowerCase();
		var name = config.irc.name.toLowerCase();

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
}