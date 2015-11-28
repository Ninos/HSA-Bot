'use strict';

module.exports = {
	cache: {},
	get: function ( key ) {
		if( !this.cache[key] ) {
			return;
		}

		if( this.cache[key].expire < Math.floor(Date.now() / 1000) ) {
			return;
		}

		return this.cache[key].value;
	},
	set: function ( key, value, expire ) {
		this.cache[key] = {
			expire: Math.floor(Date.now() / 1000) + expire,
			value: value
		};
	}
};