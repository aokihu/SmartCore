'use strict';

const mqtt = require('mqtt');
const mqtt_regex = require('mqtt-regex');
const Setting = require('../setting.json');

//
// MQTT 消息定义
//

const prefix  = "/local/storage/#";
const methods = ['add','remove','list','set','get'];

// 模式定义
const pattern = `/local/storage/+db/+method/#other`;
const dbInfo  =  mqtt_regex(pattern).exec;

var client = mqtt.connect(Setting[Setting.Mode].mqtt_server);

// @event connect
client.on('connect', () => {

  // 设置监听事件
  client.subscribe(prefix);
  console.log('connect server');

});

client.on('message', (topic, msg) => {

  let params = dbInfo(topic.toString());
  let _data  = msg.toString() ? JSON.parse(msg.toString()) : null;

  console.log(params);

})
