'use strict';
var mqtt = require('mqtt'),
    usbDetect = require('usb-detection'),
    Setting = require('./setting.json')

var client = mqtt.connect(Setting[Setting.Mode].mqtt_server);
//
client.on('connect', () => {
//   // client.publish('/local/music/play/playlist',JSON.stringify({file:"http://hls.qd.qingting.fm/live/2963035.m3u8?bitrate=64"}));
client.publish('/local/music/play/single',JSON.stringify({file:"/home/orangepi/test2.mp3"}));
//   // setTimeout(()=>{
//   //   client.publish('/local/music/next');
//   // },3000)
//
//   // setTimeout(()=>{
//   //   client.publish('/local/music/stop');
//   // },30000)
});



// usbDetect.on('add', function(device) {
//     console.log(device);
// });
