'use strict';

module.exports = {
	message: function ( message ) {
		var args = this.parse( message );

		var mention = args[0];
		var module = args[1];
		var param = args.slice();
		param.splice( 0, 2 );

		return {
			mention: mention,
			module: module,
			param: param
		};
	},
	pm: function ( pm ) {
		var args = this.parse( pm );

		var module = args[0];
		var param = args.slice();
		param.splice( 0, 1 );

		return {
			module: module,
			param: param
		};
	},
	parse: function ( content ) {
		var args = content.split( ' ' );

		return args;
	}
}