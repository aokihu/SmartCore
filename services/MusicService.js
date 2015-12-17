'use strict';

var mqtt = require('mqtt'),
    mqtt_regex = require("mqtt-regex"),
    MusicPlayer = require('mplayer'),
    _ = require('lodash'),
    Setting = require('../setting.json')

var musicPlayer = new MusicPlayer({verbose: false,debug: false});
var status = 'idle';  // 播放器当前状态
var client = mqtt.connect(Setting[Setting.Mode].mqtt_server);


//
// 设置监听事件定义
// set 是单向传输信号
// get 是双向传输信号,数据又可能是由其它服务返回
//

const prefix = '/local/music/#';

const setActions = [
  '/play/playlist',
  '/play/single',
  '/stop',
  '/next',
  '/prev',
  '/vol_up',
  '/vol_down',
  '/vol_set'
];

const getActions= [
  '/status',
  '/library',
  '/playlist'
];

//
// 广播事件定义
//
const publishPrefix = {
  'music':'/local/music',
  'storage':'/local/storage'
}

// 消息模式注册
var pattern = "/local/music/+method/+action/#playMode";
var musicPlayerInfo = mqtt_regex(pattern).exec;

// 监听播放器事件
// @event stop
musicPlayer.on('stop', (status)=>client.publish(`${publishPrefix.music}/get${publishAction.music.status}`, JSON.stringify({status:'idle'})))

// 监听MQTT事件
// @event connect
client.on('connect', () => {

  //
  // 注册监听事件
  //

  setActions.forEach( action => client.subscribe(`${prefix}${action}`));
  getActions.forEach( action => client.subscribe(`${prefix}${action}`));

});

// 处理接收到的消息
// @event message
client.on('message', (topic,msg) => {

  let params = musicPlayerInfo(topic.toString());
  console.log('music',params);

  if(params && params.method === "set" && params.action){
    switch (params.action) {
        //
        //向后播放
        //
      case 'next':
        musicPlayer.next();
        console.log('next music');
        break;
        //
        // 向前播放
        //
      case 'prev':
        musicPlayer.prev();
        console.log('prev music');
        break;
        //
        // 停止播放
        //
      case 'stop':
        musicPlayer.stop();
        status = "idle"
        console.log('music stop');
        break;
        //
        // 播放音乐或者播放列表
        //
      case 'play':
        // 分别处理单曲和播放列表
        if(params.playMode[0] == 'single'){
          var msg =  msg ? JSON.parse(msg.toString()) : null;
          musicPlayer.openFile(msg.file);
          // 广播播放器的状态
          client.publish(`${publishPrefix.music}/get${publishAction.music.status}`, JSON.stringify({status:'idle'}))
          break;
        }
        // 播放播放列表
        if(params.playMode[0] == 'playlist'){
          var msg =  msg ? JSON.parse(msg.toString()) : null;
          musicPlayer.openPlaylist(msg.file);
          // 广播播放器的状态
          client.publish(`${publishPrefix.music}/get${publishAction.music.status}`, JSON.stringify({status:'idle'}))
          break;
        }
        status = "playing";
        console.log('music play');
        break;
      default:
        break;
    }

  }
  //
  // 获取音乐库的数据
  //
  else if(params && params.method == 'get'){
    console.log("get",params);
    switch (params.action) {
      case 'palylist':
        client.publish('/local/storage/playlist/list')
        break;
      case 'library':
      default:
        client.publish('/local/storage/music/list');
        break;
    }
  }


});
