'use strict';

const config = require( './config.js' );
const parser = require( './lib/parser.js' );

var app = require( './app/irc.js' )( {
	config: config,
	parser: parser
} );