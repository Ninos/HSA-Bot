'use strict';

module.exports = {
	event: null,
	init: function () {
		let EventEmitter = require( 'events' ).EventEmitter;
		this.event = new EventEmitter();

		return this;
	},
	message: function ( args ) {
		this.event.emit( 'message', args );
		this.event.emit( 'message_' + args.pm ? 'private' : 'public', args );
		this.event.emit( 'message_' + args.module, args );
	},
	say: function ( args, content ) {
		this.event.emit( 'say', args, content );
	},
	error: function ( type, args, error ) {
		if ( type == 'system' ) {
			console.error( error );
		}

		this.say( args, error.toString() );
	}
};