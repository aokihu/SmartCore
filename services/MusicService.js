'use strict';

var mqtt = require('mqtt'),
    mqtt_regex = require("mqtt-regex"),
    MusicPlayer = require('mplayer'),
    _ = require('lodash'),
    Setting = require('../setting.json')

var musicPlayer = new MusicPlayer({verbose: false,debug: false});
var status = 'idle';  // 播放器当前状态
var client = mqtt.connect(Setting[Setting.Mode].mqtt_server);

// 消息处理

var prefix = "/local/music/"
var handleMessages = ['play/playlist',
                      'play/single',
                      'stop',
                      'next',
                      'prev',
                      'vol_up',
                      'vol_down',
                      'vol_set'];

const broadcastMessages = ['message/status'];

// 消息模式注册
var pattern = prefix + "+action/#playMode";
var musicPlayerInfo = mqtt_regex(pattern).exec;

musicPlayer.on('stop', (status)=>{
  client.publish(prefix + broadcastMessages, JSON.stringify({status:'idle'}));
})

client.on('connect', function(){

  // 注册监听消息
  handleMessages.forEach((msg)=>{
    client.subscribe(prefix + msg);
  })

});

// 处理接收到的消息
client.on('message', function(topic,msg){

  var params = musicPlayerInfo(topic.toString());

  if(params && params.action){
    switch (params.action) {
      case 'next':
        musicPlayer.next();
        console.log('next music');
        break;
      case 'prev':
        musicPlayer.prev();
        console.log('prev music');
        break;
      case 'stop':
        musicPlayer.stop();
        status = "idle"
        console.log('music stop');
        break;
      case 'play':
        // 分别处理单曲和播放列表
        if(params.playMode[0] == 'single'){
          var msg =  msg ? JSON.parse(msg.toString()) : null;
          musicPlayer.openFile(msg.file);
        }
        if(params.playMode[0] == 'playlist'){
          var msg =  msg ? JSON.parse(msg.toString()) : null;
          musicPlayer.openPlaylist(msg.file);
        }
        status = "playing";
        console.log('music play');
        break;
      default:

    }

    // 广播播放器的状态
    client.publish(prefix + broadcastMessages, JSON.stringify({status:status}));
  }


});
