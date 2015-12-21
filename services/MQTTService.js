const mosca = require('mosca');
const spawn = require('child_process').spawn;

// 启动Mosca服务
var settings = {
  port: 1883
};

var server = new mosca.Server(settings);

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
  console.log('Published', packet.topic.toString(),packet.payload.toString());
});

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
}
