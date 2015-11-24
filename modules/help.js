'use strict';

module.exports = {
	name: 'help',
	global: {},
	init: function ( param ) {
		this.global = param;

		this.listener();

		return this;
	},
	listener: function () {
		var api = this.global.api;

		api.event.on( 'message_' + this.name, function ( args ) {
			api.say( args, "hallo" );
		} );
	}
}