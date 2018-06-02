var PORT = 33333;
var SERVER = '192.168.1.10';

var dgram = require('dgram');
var client = dgram.createSocket('udp4');

var message = new Buffer('My KungFu is Good!');
client.send(message, 0, message.length, 33333, SERVER, function(err, bytes) {
    console.log(err);
    console.log('UDP message sent to ' + SERVER + ':'+ 33333);
    client.close();
});
