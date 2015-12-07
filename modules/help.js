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
		var that = this,
			api = this.root.lib.api,
			modules = this.root.modules;

		api.event.addListener( 'message_' + this.name, function ( args ) {
			var content = [];
			Object.keys( modules ).map( function ( key ) {
				var value = modules[key];

				if ( value.name != that.name ) {
					content.push( that.name + ' ' + value.name );
				}
			} );

			api.say( args, content.join( "\n" ) );
		} );
	}
};