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

const mqtt = require('mqtt')
const mqtt_regex = require('mqtt-regex')
const Timer = require('../modules/Timer.js')
const Setting = require('../setting.json')
const action = require('../action.js')

var client = mqtt.connect(Setting[Setting.Mode].mqtt_server);

const setActions = action.flat(action.timer.set);
const getActions = action.flat(action.timer.get);

const info = mqtt_regex(`${action.timer.prefix}/+method/+append`).exec;

/* 计时器配置 */
var timer = new Timer();
timer.load(process.cwd()+Setting.data.schedule_file);
timer.start();
setInterval( () => {timer.save()}, 1000 * 3600);

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

client.on('message', (topic, msg) => {

  let _topic = topic.toString();
  let _msg  = msg ? msg.toString() : '{}';
  let params = info(_topic);

  if(params && params.method == 'get'){

    if(params.append == 'schedule'){
      client.publish('/local/timer/pub/schedule', JSON.stringify(timer.schedule));
    }

  }


  if(params && params.method == 'set'){

    let subMethod = params.append;
    let _data = JSON.parse(JSON.parse(msg));
    console.log(_data, typeof _data);

    switch (subMethod) {
      case 'remove':
        if(timer.remove(_data.id)){
          client.publish('/local/timer/pub/schedule', JSON.stringify(timer.schedule));
          timer.restart();
        }
        break;

      case 'update':
        if(timer.update(_data)){
          client.publish('/local/timer/pub/schedule', JSON.stringify(timer.schedule));
          timer.restart();
        }
        break;
      default:

    }
  }

});
