'use strict';

var api = require( '../lib/api.js' ),
	modules = require( '../lib/modules.js' );

module.exports = {
	name: 'help',
	init: function () {

		this.hooks();

		return this;
	},
	hooks: function () {
		var that = this;

		api.event.addListener( 'message_' + this.name, function ( args ) {
			that.call( args );
		} );
	},
	call: function ( args ) {
		var that = this,
			mods = modules.get();

		var content = [];
		Object.keys( mods ).map( function ( key ) {
			var value = mods[key];

			if ( value.name != that.name ) {
				content.push( that.name + ' ' + value.name );
			}
		} );

		api.say( args, content.join( "\n" ) );
	}
};