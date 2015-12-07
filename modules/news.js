'use strict';

module.exports = {
    name: 'news',
    root: null,
    url: {
        news: 'http://www.hs-augsburg.de/index.html'
    },

    init: function ( root ) {
        this.root = root;

        this.hooks();

        return this;
    },
    hooks: function () {
        var that = this;

        // Get the data object from url/cache with all necessary news information
        that.getData(function ( data ) {

            // Check if new news exists
            if ( !data ) {
                api.say( 'No news available' );

                return;
            }

            // Generate output content
            var content = [];
            var counter = 0;
            Object.keys( data[counter] ).map( function ( key ) {
                var value = data[counter][key];

                content.push( value.title );
            } );

            api.say( content.join( "\n" ) );
        } );
    },

    getData: function (callback) {
        var that = this,
            cache = this.root.lib.cache,
            request = require( 'request' ),
            cheerio = require( 'cheerio' ),
            moment = require( 'moment' );


        // Return cache if exists and not expired
        var data = cache.get( that.name );
        if ( data ) {
            callback( data );

            return;
        }

        data = {};

        // Get html, parse and return object
        request( this.url, function ( error, response, body ) {
            if ( error || response.statusCode != 200 ) {
                console.log( 'Connection error' );

                return;
            }

            var $ = cheerio.load( body );
            var counter = 0;
            // Loop for every element with the classes content & keyword
            $(  '#content.px131' ).each( function () {

                // Write needed information as plain text in object
                data[counter] = {
                    title: $( this ).find( '[data-role="content"] h3' ).text().replace( /\u00AD/g, '' ).trim()
                };
                counter++;
            } );

            // Set the cache with an expire date of 3600 seconds
            cache.set( that.name + '_data_' + data, 3600 );

            callback( data );
        } );
    }
};