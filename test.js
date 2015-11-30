'use strict';

var mqtt = reuqire('mqtt'),
    Setting = require('./setting');


var client = mqtt.connect(Setting[Setting.Mode].mqtt_server);

client.on('connect', ()=>{
  console.log('connected');

  client.subscribe('/local/timer/schedule');
})


client.on('message', (topic, msg)=>{

  var topic = topic.toString();

  if(topic == "/local/timer/schedule"){
    console.log(msg.toString())
  }

})
