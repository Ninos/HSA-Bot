'use strict';

module.exports = {
	name: 'reminder',
	init: function () {
		this.hooks();

		return this;
	},
	hooks: function () {
		var api = require( '../lib/api.js' );

		api.event.addListener( 'message_' + this.name, function ( args ) {
			if ( args.param[0] == undefined || args.param[0] == '' ) {
				return;
			}

			if ( args.param[1] == undefined || args.param[1] == '' ) {
				return;
			}

			var seconds = args.param[0] * 1000;

			var param = args.param.slice();
			param.splice( 0, 1 );
			var content = param.join( ' ' );

			setTimeout( function () {
				api.say( args, content );
			}, seconds );
		} );
	}
};