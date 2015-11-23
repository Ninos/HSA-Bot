'use strict';

const config = require( './config.js' );
const api = require( './lib/api.js' );
const parse = require( './lib/parse.js' );

var app = require( './app/irc.js' )( {
	config: config,
	api: api,
	parse: parse
} );