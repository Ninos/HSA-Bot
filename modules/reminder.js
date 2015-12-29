'use strict';

let api = require( '../lib/api.js' );

module.exports = {
	name: 'reminder',
	description: 'With this module you can set a reminder',
	help: [
		'param 1: time in sec',
		'param 2: content'
	],
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
			api.error( 'validation', args, new Error( 'Not valid time' ) );

			return;
		}

		if ( args.param[1] == undefined || args.param[1] == '' ) {
			api.error( 'validation', args, new Error( 'Not valid content' ) );

			return;
		}

		let seconds = args.param[0] * 1000;

		let param = args.param.slice();
		param.splice( 0, 1 );
		let content = param.join( ' ' );

		setTimeout( function () {
			api.say( args, content );
		}, seconds );
	}
};