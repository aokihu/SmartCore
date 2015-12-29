'use strict';
const mqtt = require('mqtt');
const Setting = require('../setting.json');
const action = require('../action.js');

//
// 提供设备信息状态服务
//
//

// mqtt client
var client = mqtt.connect(Setting[Setting.Mode].mqtt_server);


// const prefix = '/local/music/#';
const prefix = action.machine.prefix;

const setActions = action.flat(action.machine.set);
const getActions = action.flat(action.machine.get);

// 注册监听事件
client.on('connect', ()=>{
  console.log('Machine services connect mqtt server');
  setActions.forEach( action => client.subscribe(`${prefix}/set${action}`));
  getActions.forEach( action => client.subscribe(`${prefix}/get${action}`));
});
