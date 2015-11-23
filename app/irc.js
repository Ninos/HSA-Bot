'use strict';

module.exports = function ( param ) {
	var config = param.config;
	var api = param.api;
	var parse = param.parse;

	var irc = require( 'irc' );

	var client = new irc.Client( config.irc.server, config.irc.name, {
		channels: config.irc.channels,
	} );

	client.addListener( 'message', function ( from, to, message ) {
		var args = parse.content( message );
		var module = args.module;
		var param = args.param;

		api.message(module, param, from, to, false);
	} );
}