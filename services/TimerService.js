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

var mqtt = require('mqtt')
    Timer = require('../modules/Timer.js')
    Setting = require('../setting.json')

var client = mqtt.connect(Setting[Setting.Mode].mqtt_server);
var timer = new Timer(Setting[Setting.Mode].schedule_file);

timer.on('timeout', function(evt){

  switch (evt.action) {
    case "play single":
      console.log('play music');
      client.publish('/local/music/play/single', JSON.stringify({file:evt.data}));
      break;
    case "play playlist":
      console.log('play playlist');
      client.publish('/local/music/play/playlist', JSON.stringify({file:evt.data}));
      break;
    default:
  }

});

client.on('connect', function(){
  client.subscribe('/local/timer/start');
  client.publish('/local/timer/start', 'Hello mqtt');
})

client.on('message', function(topic, msg){
  console.log(topic.toString());
})
