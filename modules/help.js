'use strict';

module.exports = {
	name: 'help',
	global: {},
	init: function ( param ) {
		this.global = param;

		this.hooks();

		return this;
	},
	hooks: function () {
		var api = this.global.api;

		api.event.addListener( 'message_' + this.name, function ( args ) {
			api.say( args, "hallo" );
		} );
	}
}