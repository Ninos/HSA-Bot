'use strict';

module.exports = {
	parse: function ( content ) {
		var args = content.split( ' ' );

		return args;
	},
	message: function ( message ) {
		var args = this.parse( message ),
			mention = args[0],
			module = args[1],
			param = args.slice();
		param.splice( 0, 2 );

		return {
			mention: mention,
			module: module,
			param: param
		};
	},
	pm: function ( pm ) {
		var args = this.parse( pm ),
			module = args[0],
			param = args.slice();
		param.splice( 0, 1 );

		return {
			module: module,
			param: param
		};
	},
	date: function ( date, format ) {
		var moment = require( 'moment' );

		return moment( date, 'DD.MM.YYYY' ).format( format );
	},
	isMentioned: function ( mention, name ) {
		var mention = mention.toLowerCase(),
			name = name.toLowerCase();

		if (
			mention == name
			|| mention.replace( /\W/g, '' ) == name.replace( /\W/g, '' )
		) {
			return true;
		}

		if (
			mention == '@' + name
			|| mention.replace( /\W/g, '' ) == '@' + name.replace( /\W/g, '' )
		) {
			return true;
		}

		return false;
	}
};