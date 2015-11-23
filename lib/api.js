'use strict';

module.exports = {
	event: null,
	init: function () {
		var EventEmitter = require( 'events' ).EventEmitter;
		this.event = new EventEmitter();

		return this;
	},
	message: function ( args ) {
		var response = [];

		this.event.emit( 'message', args );
		this.event.emit( 'message_' + args.pm ? 'private' : 'public', args );
		response = this.event.emit( 'message_' + args.module, args );

		return response;
	}
}