var mqtt = require('mqtt'),
    mqtt_regex = require("mqtt-regex"),
    // MusicPlayer = require('../Modules/MusicPlayer.js'),
    // MusicPlayer = require('../Modules/player.js'),
    MusicPlayer = require('mplayer'),
    _ = require('lodash')
    Setting = require('../setting.json')

var musicPlayer = new MusicPlayer({verbose: false,debug: false});
var client = mqtt.connect(Setting[Setting.Mode].mqtt_server);

// 消息处理

var handleMessagePrefix = "/local/music/"
var handleMessages = ['play/playlist','play/single','stop','next','prev','vol_up','vol_down','vol_set'];

// 消息模式注册
var pattern = handleMessagePrefix + "+action/#playMode";
var musicPlayerInfo = mqtt_regex(pattern).exec;


client.on('connect', function(){

  // 注册监听消息
  _.forEach(handleMessages, function(msg){
    client.subscribe(handleMessagePrefix + msg);
  });

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
        console.log('music play');
        break;
      default:

    }
  }


});
