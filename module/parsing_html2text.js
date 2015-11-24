/**
 * Created by Dennis on 16.11.2015.
 */
var request = require('request');
var content = [];
var strOutput = "";

function input(date) {
    //Example: 2015320
    var day = date.slice(0, 2);
    var month = date.slice(3, 5) - 1;
    var year = date.slice(6, 10);

    console.log(day);
    console.log(month);
    console.log(year);
    if (day + "" == "NaN" || day < 1) {
        day = 1;
    }
    if (month + "" == "NaN" || month < 1) {
        month = 0;
    }
    if (year + "" == "NaN" || year < 1900) {
        year = 1900;
    }

    var formattedDate = Math.floor((new Date(year, month, day).getTime() - new Date(year, 0, 1).getTime()) / 86400000) + 1;
    formattedDate = year + formattedDate;
    console.log(formattedDate);
    call('http://augsburg.my-mensa.de/essen.php?v=4825393&hyp=1&lang=de&mensa=aug_friedbergerstr_fh', formattedDate)
}

function call(url, formatedDate) {
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Content
            var req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.readyState == XMLHttpRequest.DONE) {
                    quelltext = req.responseText;
                    console.log(text);
                }
            }
            req.open("get", url);
            req.setRequestHeader("Content-Encoding", "UTF-8");
            req.send();

        }
        var output = [];
        for (var i = 0; i < content.length; i++) {
            if (content[i].match(formatedDate)) {
                if (content[i].match('essen0' || 'essen1' || 'essen2' || 'essen3' || 'essen4')) {
                    // beinhaltet den Datensatz mit dem essen aber noch in roh-format
                    output.push(content[i + 1]);

                } else {
                }
            }
        }

        // parsing from html-version to plain-text
        for (var j = 0, j <
        output.length;
        j++
        )
        {
            var encodeOutput = output[j].replace("&shy;", "");
            strOutput = +encodeOutput.join() & '/n';
        }
        // parsen nicht selber manuell sondern per einer api aufrufen automatisch von js
        // jsdom nach bestimmte Begriffen filtern einfacher als mit js selbst
        // selector jQuery einzelne zeilen aus im objekt array speichern -> über html request kommt nur der ganzer block zurück


    }
else
    {
        console.log("Es ist ein Fehler beim Aufrufen der Website aufgetreten");
    }
}
)
;
return strOutput;
}

input('16.11.2015');

// 1. jsQuery selectors sind nur mit css aufgebaut heißt in doctype
// 2. header bekomme ich in string var aber nicht den body
// 3. filtern funktioniert mit js nicht