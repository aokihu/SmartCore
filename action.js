'use strict';
const _ = require('lodash');

//
// 行为定义
// prefix 是消息前缀
// set 是订阅监听的消息,数据是单向传递,消息方向:消息源 ====> 订阅者
// get 也是订阅监听的消息,数据是双向传递,消息方向:消息源(通过pub通道接受数据) <====> 订阅者
// pub 发布消息
//

exports.music = {
  'prefix':'/local/music',
  'set':{
    'play':{
      'single':'/play/single',      // 播放单曲, data:{filename:播放的音乐名称}
      'playlist':'/play/playlist'   // 播放播放列表, data:{filename:播放列表名称}
    },
    'stop':'/stop',                 // 停止播放
    'next':'/next',                 // 切换到下一首音乐
    'prev':'/prev',                 // 切换到前一首音乐
    'volUp':'/vol_up',              // 增加音量
    'volDown':'/vol_down',          // 降低音量
    'volSet':'/vol_set'             // 设置音量,data:{vol:音量绝对值(0-100)}
  },
  'get':{
    'status':'/status'              // 播放器状态, return:{status:[idle|playing]}
  },
  'pub':{
    'status':'/status'              // 播放器状态, return:{status:[idle|playing]}
  }
}

exports.timer = {
  'prefix':'/local/timer',
  'get':{
    'schedule':'/schedule'
  },
  'set':{
    'add':'/add',
    'remove':'/remove',
    'update':'/update'
  },
  'pub':{
    'schedule':'/schedule'
  }
}

exports.db = {
  'prefix':'/local/db',
  'get':{
    'list':'/list',
    'get':'/get'
  },
  'set':{
    'set':'/set',
    'add':'/add',
    'remove':'/remove'
  },
  'pub':{
    'list':'/list',
    'get':'/list'
  }
}

////////////////
//
// 工具方法定义
//
////////////////

/**
 * 将对象数据转化成平坦的数组
 * @param  {object} data 层级对象
 * @return {array}      平坦的数组
 */
exports.flat = function _flatToArray(obj){

  var ret = new Array(); // 输出结果

  for(let t in obj){
    let o = obj[t];

    if(_.isPlainObject(o)){
      _flatToArray(o).forEach((item) => {
        ret.push(item);
      });
    }
    else {
      ret.push(o)
    }
  }

  return ret;
}
