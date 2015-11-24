'use strict';

module.exports = {
	name: 'troll',
	root: null,
	init: function ( root ) {
		this.root = root;

		this.hooks();

		return this;
	},
	hooks: function () {
		var api = this.root.lib.api;

		api.event.addListener( 'message_' + this.name, function ( args ) {
			if ( args.param[0] == undefined || args.param[0] == '' ) {
				return;
			}

			if ( args.param[1] == undefined || args.param[1] == '' ) {
				return;
			}

			var to = args.param[0];
			if ( to.substring( 0, 1 ) == '@' ) {
				to = to.substring( 1 );
			}

			var param = args.param.slice();
			param.splice( 0, 1 );
			var content = param.join( ' ' );

			args.to = to;

			api.say( args, content );
		} );
	}
}