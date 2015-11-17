/**
 * Created by Dennis on 16.11.2015.
 */
var request = require('request');
var content = [];
var index = 0;
var strOutput = "";

function input(date) {
    //16.11. ->
    // Problem 319. Tag im Jahr
    var formatedDate = data.slice(0, 6);
    call('http://augsburg.my-mensa.de/essen.php?v=4825393&hyp=1&lang=de&mensa=aug_friedbergerstr_fh', formatedDate)
}

function call(url, formatedDate) {
    request(url, function (error, response, body) {
        if(!error && response.statusCode == 200) {
            if (formatedDate.charAt(2) == '.' && formatedDate.charAt(5) == '.') {
                while (!endOfLine) {
                    content[index] = body.content.split('/n');
                    index = index + 1;
                }
                var output = [];
                for (var i = 0; i < content.length; i++) {
                    if(content[i].match(formatedDate)) {
                        if(content[i].match('essen0' || 'essen1' || 'essen2' || 'essen3' || 'essen4')) {
                            // beinhaltet den Datensatz mit dem essen aber noch in roh-format
                            output.push(content[i+1]);

                        } else {}
                    } else {
                        console.log("Datum wurde nicht gefunden");
                    }
                }
                for (var j = 0, j < output.length; j++) {
                    strOutput =+ output[j].join() & '/n';
                }
                // parsen nicht selber manuell sondern per einer api aufrufen automatisch von js
                // jsdom nach bestimmte Begriffen filtern einfacher als mit js selbst
                // selector jQuery einzelne zeilen aus im objekt array speichern -> über html request kommt nur der ganzer block zurück
                // -> keine zeilenweise implementierung
            } else {
                console.log("Ein ungültiges Datum wurde eingegeben");
            }
        } else {
            console.log("Es ist ein Fehler beim Aufrufen der Website aufgetreten");
        }
    });
    return strOutput;
}

input('16.11.2015');
