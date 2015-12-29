// 本地发现服务
'use strict';
var udpSock = require('dgram'),
	  os = require('os'),
    Setting = require('../setting.json');

var info = {
	'model':Setting.hardware.model,
	'hw_ver':Setting.hardware.version,
	'sw_ver':Setting.software.version
}

// 启动Discover服务
var server = udpSock.createSocket("udp4");
server.bind(9900, function(){
	server.setBroadcast(true);
	server.setMulticastTTL(128);

	// 获得本机IP地址
	// os.networkInterfaces().eth0.forEach(function(item){
	// 	if(item.family === 'IPv4')
	// 		// IPv4 = item.address;
	// 		info.ip = item.address;
	// });

	var ifaces = os.networkInterfaces();

	for(let at in ifaces){
	  // 搜索非内网的网络端口
	  let iface = ifaces[at];

	  iface.forEach(mesh => {
	    if(mesh.internal === true)
	      return false;

	    if(mesh.family === 'IPv4'){
	      info.ip = mesh.address;
				server.addMembership("234.0.0.1", mesh.address);
				console.log(`join 234.0.0.1@${mesh.address}`)
	      return false;
	    }
	  })

	}
});



server.on('listening', function(){
	console.log("Discover Server listening...");
	console.log("Server Infomation:",
		"\n\tAddress:"+info.ip,
		"\n\tPort:"+server.address().port);
});

server.on('message', function(msg, client){

	var strMsg = msg.toString();

	console.log("Client Info:", client);

	if(strMsg === 'hello')
	{
		var retMsg = new Buffer(JSON.stringify(info));

		server.send(retMsg,0,retMsg.length,9901,'234.0.0.1');
	}
});

module.exports = server;
