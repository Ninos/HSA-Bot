'use strict';

module.exports = {
	name: 'troll',
	global: {},
	init: function ( param ) {
		this.global = param;

		this.listener();

		return this;
	},
	listener: function () {
		var api = this.global.api;

		api.event.on( 'message_' + this.name, function ( args ) {
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