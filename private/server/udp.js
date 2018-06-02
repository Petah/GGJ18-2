var PORT = 33333;
var HOST = '0.0.0.0';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var client = dgram.createSocket('udp4');

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);

    var message = new Buffer('My KungFu is Good!');
    client.send(message, 0, message.length, 33334, remote.address, function(err, bytes) {
        console.log(err);
        console.log('UDP message sent to ' + remote.address +':'+ 33334);
    });
});

server.bind(PORT, HOST);
