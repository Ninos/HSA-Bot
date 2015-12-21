'use strict';

let api = require( '../lib/api.js' );

module.exports = {
	name: 'troll',
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
		if ( args.param[0] == undefined || args.param[0] == '' ) {
			return;
		}

		if ( args.param[1] == undefined || args.param[1] == '' ) {
			return;
		}

		let to = args.param[0];
		if ( to.substring( 0, 1 ) == '@' ) {
			to = to.substring( 1 );
		}

		let param = args.param.slice();
		param.splice( 0, 1 );
		let content = param.join( ' ' );

		args.from = null;
		args.to = to;

		api.say( args, content );
	}
};