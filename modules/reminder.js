'use strict';

let api = require( '../lib/api.js' );

module.exports = {
	name: 'reminder',
	description: 'With this module you can set a reminder',
	help: [
		'param 1: time in sec',
		'param 2: content'
	],
	timers: [],
	timed: [],
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
		let that = this;

		if ( args.param[0] == undefined || args.param[0] == '' ) {
			api.error( 'validation', args, new Error( 'No valid time' ) );

			return;
		}

		if ( args.param[1] == undefined || args.param[1] == '' ) {
			api.error( 'validation', args, new Error( 'No valid content' ) );

			return;
		}

		let seconds = args.param[0] * 1000;

		let param = args.param.slice();
		param.splice( 0, 1 );
		let content = param.join( ' ' );

		let timer = setTimeout( function () {
			that.timed.push( timer );

			api.say( args, content );
		}, seconds );

		this.timers.push( args.param[0] + args.param[1] );

		for ( var i = 0; i < this.timed.length; i ++ ) {
			if ( this.timers[i] == this.timed[i] ) {
				this.timers[i] == this.timers[i + 1];
			}
		}
	},
	cancelTimer: function ( timer ) {
		clearTimeout( timer );
	},
	showTimer: function () {
		api.say( args, timers );
	},
	showTimed: function () {
		api.say( args, timed );
	}
};