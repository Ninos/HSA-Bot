'use strict';

module.exports = {
	name: 'help',
	init: function () {

		this.hooks();

		return this;
	},
	hooks: function () {
		var that = this,
			api = require( '../lib/api.js' );

		api.event.addListener( 'message_' + this.name, function ( args ) {
			that.call( args );
		} );
	},
	call: function ( args ) {
		var that = this,
			api = require( '../lib/api.js' ),
			modules = require( '../lib/modules.js' ).get();

		var content = [];
		Object.keys( modules ).map( function ( key ) {
			var value = modules[key];

			if ( value.name != that.name ) {
				content.push( that.name + ' ' + value.name );
			}
		} );

		api.say( args, content.join( "\n" ) );
	}
};