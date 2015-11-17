'use strict';

module.exports = function ( param ) {
	var config = param.config;
	var parser = param.parser;

	var irc = require( 'irc' );

	var client = new irc.Client( config.irc.server, config.irc.name, {
		channels: config.irc.channels,
	} );

	client.addListener( 'message', function ( from, to, message ) {
		var args = parser.parse( message );
		console.log( args );
	} );
}