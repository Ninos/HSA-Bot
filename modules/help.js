'use strict';

let api = require( '../lib/api.js' ),
	modules = require( '../lib/modules.js' );

module.exports = {
	name: 'help',
	description: 'This module is trying to help you out understanding the syntax and finding relevant modules',
	help: [
		'param 1: module (if empty you\'ll get a list of modules)'
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

		api.event.addListener( 'message', function ( args ) {
			that.catch( args );
		} );
	},
	call: function ( args ) {
		let that = this,
			mods = modules.get(),
			content = [];

		// Check if param 1 is empty
		if ( args.param[0] == undefined || args.param[0] == '' ) {
			content.push( 'Following you see a full list of available modules. If you want to get more informations about a module, add the module name to the help request.' );

			Object.keys( mods ).map( function ( key ) {
				let value = mods[key];

				if ( value.name != that.name ) {
					content.push( value.name + ': ' + value.description );
				}
			} );

			api.say( args, content.join( "\n" ) );
		} else if ( mods[args.param[0]] ) {
			let module = mods[args.param[0]],
				help = module.help;

			content.push( 'Name: ' + module.name );
			content.push( 'Description: ' + module.description );

			if ( Array.isArray( help ) ) {
				content = content.concat( help );
			} else if ( typeof help == 'string' ) {
				content.push( help );
			}

			api.say( args, content.join( "\n" ) );
		} else {
			api.say( args, new Error( 'Module not found' ) );
		}
	},
	catch: function ( args ) {
		let mods = modules.get();

		if ( mods[args.module] ) {
			return;
		}

		api.say( args, new Error( 'Module not found. Type help for more informations.' ) );
	}
};