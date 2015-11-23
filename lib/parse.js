'use strict';

module.exports = {
	content: function ( content ) {
		var args = this.parse( content );

		var module = args[0];
		var param = args.slice();
		param.splice( 0, 1 );

		return {module: module, param: param};
	},
	parse: function ( content ) {
		var args = content.split( ' ' );

		return args;
	}
}