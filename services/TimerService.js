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
    Timer = require('../Modules/Timer.js')
    Setting = require('../setting.json')

var client = mqtt.connect(Setting[Setting.Mode].mqtt_server);
var timer = new Timer();

timer.on('timeout', function(evt){

  switch (evt.action) {
    case "play single":
      client.publish('/local/music/play/single', evt.data);
      break;
    case "play playlist":
      client.publish('/local/music/play/playlist', evt.data);
      break;
    default:
  }

});

client.on('connect', function(){
  client.publish('/local/timer/start', 'Hello mqtt');
})

client.on('message', function(topic, msg){

})
