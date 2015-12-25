'use strict';
/**
 * 计时器服务单元
 * @description 提供一个定时服务，当到达指定时间后执行特定的任务
 *              本定时服务通过使用timeout来实现，因此对于系统的开销来说并不大
 *
 * 定时数据格式, *代表任意取值
 * {
 * 	"Y": (Array|*)
 * }
 */

var mqtt = require('mqtt'),
    Timer = require('../modules/Timer.js'),
    Setting = require('../setting.json'),
    action = require('../action.js')

var client = mqtt.connect(Setting[Setting.Mode].mqtt_server);

const setActions = action.flat(action.timer.set);
const getActions = action.flat(action.timer.get);

/* 计时器配置 */
var timer = new Timer();
timer.load(process.cwd()+Setting.data.schedule_file);
timer.start();

timer.on('timeout', function(evt){

  switch (evt.action) {
    case "play music":
      console.log('play music');
      client.publish('/local/music/set/play/single', JSON.stringify({file:evt.data}));
      break;
    case "play playlist":
      console.log('play playlist');
      client.publish('/local/music/set/play/playlist', JSON.stringify({file:evt.data}));
      break;
    default:
  }

});

client.on('connect', ()=>{
  // 订阅关注消息
  setActions.forEach(act => client.subscribe(`${action.timer.prefix}/set${act}`));
  getActions.forEach(act => client.subscribe(`${action.timer.prefix}/get${act}`));

});

client.on('message', (topic, msg) =>{
  let _topic = topic.toString();

  switch (_topic){
    case '/local/timer/get/schedule':
    default:
      client.publish('/local/timer/pub/schedule', JSON.stringify(timer.schedule));
    break;
  }
});
