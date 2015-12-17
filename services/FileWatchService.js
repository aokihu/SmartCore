'use strict';
/*
 *  文件监视服务
 *  监听指定文件中的文件改变事件
 */

const Setting = require('../setting.json');
const fs = require('fs');
const StringDecoder = require('string_decoder').StringDecoder;
const mqtt = require('mqtt');


// MQTT 消息定义
const publishPrefix = {
  'file':'/local/file'
}

const publishAction = {
  'music':{
    'add':'/add/music',       // 添加文件
    'remove':'/remove/music', // 删除文件
    'delete':'/remove/music'  // 删除文件
  }
}

// 字符解码器
var decoder = new StringDecoder('utf8');

// mqtt client
var client = mqtt.connect(Setting[Setting.Mode].mqtt_server);

// 注册监听事件
client.on('connect', ()=>{
  console.log('connect mqtt server');
});

/**
 * 监视音乐库的文件变动
 */
const MusicLibrary = `${process.cwd()}${Setting.watch.music}`;
fs.watch(MusicLibrary, (evt, filename) => {

  let realFilename = decoder.write(new Buffer(filename,'binary'));
  let fileData = {
    filename:realFilename,
    path:MusicLibrary
  }

  var action; // 动作

  // 判断文件是添加还是删除
  fs.stat(`${MusicLibrary}/${realFilename}`, (err, state)=>{

    //
    // Add File
    // 如果发生错误，检查是否是文件不存在，如果不存在执行删除文件动作
    //
    if(err && err.errno == -2){
      console.log(`remove file ${realFilename}`);
      action = publishAction.music.add;
    }
    else if(evt !== 'change'){

      //
      // Remove File
      // 如果没有发生错误，那么就是添加或者修改文件，一般对媒体文件只是添加动作
      //

      console.log(`add file ${realFilename}`);
      action = publishAction.music.remove;
    }
    else {
      return false;
    }

    //
    // 发送mqtt消息
    //
    client.publish(`${publishPrefix.file}${action}`, JSON.stringify(fileData));
  })

});
