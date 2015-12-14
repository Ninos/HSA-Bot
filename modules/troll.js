'use strict';

module.exports = {
	name: 'troll',
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
		var api = require( '../lib/api.js' );

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

		args.from = null;
		args.to = to;

		api.say( args, content );
	}
};