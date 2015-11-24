'use strict';

module.exports = {
	name: 'help',
	root: null,
	init: function ( root ) {
		this.root = root;

		this.hooks();

		return this;
	},
	hooks: function () {
		var that = this;

		var api = this.root.lib.api;
		var modules = this.root.modules;

		api.event.addListener( 'message_' + this.name, function ( args ) {
			var content = [];
			for ( var key in modules ) {
				if ( key == that.name ) {
					continue;
				}

				if ( ! modules.hasOwnProperty( key ) ) {
					continue;
				}

				var module = modules[key];
				content.push( that.name + ' ' + module.name );
			}

			api.say( args, content.join( "\n" ) );
		} );
	}
}