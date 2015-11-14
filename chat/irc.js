var irc = require('irc');

var client = new irc.Client('irc.freenode.net', 'HSA-Bot', {
	channels: ['#hs-augsburg'],
});

client.addListener('message', function (from, to, message) {
	console.log(from + ' => ' + to + ': ' + message);
});