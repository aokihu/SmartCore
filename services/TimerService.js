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
    mqtt-regex = require('mqtt-regex'),
    Timer = require('../modules/Timer.js'),
    Setting = require('../setting.json')

var client = mqtt.connect(Setting[Setting.Mode].mqtt_server);

/* 计时器配置 */
var timer = new Timer();
timer.load(process.cwd()+Setting[Setting.Mode].schedule_file);
timer.start();

timer.on('timeout', function(evt){

  switch (evt.action) {
    case "play music":
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

  client.subscribe('get/local/timer/schedule');
})

client.on('message', function(topic, msg){

  let topic = topic.toString();

  switch (topic):
    case 'get/local/timer/schedule':
    default:
      client.publish('/local/timer/schedule', JSON.stringify(timer.schedule));
    break;

})
