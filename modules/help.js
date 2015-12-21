'use strict';

let api = require( '../lib/api.js' ),
	modules = require( '../lib/modules.js' );

module.exports = {
	name: 'help',
	init: function () {

		this.hooks();

		return this;
	},
	hooks: function () {
		let that = this;

		api.event.addListener( 'message_' + this.name, function ( args ) {
			that.call( args );
		} );
	},
	call: function ( args ) {
		let that = this,
			mods = modules.get();

		let content = [];
		Object.keys( mods ).map( function ( key ) {
			let value = mods[key];

			if ( value.name != that.name ) {
				content.push( that.name + ' ' + value.name );
			}
		} );

		api.say( args, content.join( "\n" ) );
	}
};