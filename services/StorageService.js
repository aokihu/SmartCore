'use strict';

const mqtt = require('mqtt');
const mqtt_regex = require('mqtt-regex');
const fs = require('fs');
const sha1 = require('sha1');
const low = require('lowdb');
const storage = require('lowdb/file-sync');
const Setting = require('../setting.json');
const action = require('../action.js');

// 数据库定义😀
let _database = process.cwd()+Setting.data.database;

try{
  fs.accessSync(_database,fs.R_OK);
}
catch(err){
  fs.closeSync(fs.openSync(_database, 'w+'));
}

//
// 数据库
// music 音乐信息数据
//
const db = low(_database, {storage});



// 行为定义
const setActions = action.flat(action.db.set);
const getActions = action.flat(action.db.get);

// 模式定义
const pattern = `/local/db/+method/+db/#other`;
const dbInfo  =  mqtt_regex(pattern).exec;

var client = mqtt.connect(Setting[Setting.Mode].mqtt_server);

// @event connect
client.on('connect', () => {

  // 设置监听事件
  setActions.forEach( item => client.subscribe(`${action.db.prefix}${item}/#`));
  getActions.forEach( item => client.subscribe(`${action.db.prefix}${item}/#`));
  console.log('connect server');

});

client.on('message', (topic, msg) => {

  console.log(topic.toString());
  let _p = dbInfo(topic.toString());
  let _data  = msg.toString() ? JSON.parse(msg.toString()) : null;
  var _id = null;

  // 给数据添加一个_id属性,作为数据的查找依据
  // _id ＝ sha1(data.pro1 + data.pro2+...);
  if(_data){
    let _tmp = action.flat(_data); // 这里借用action.js中的平坦化方法，产生平坦的数组数据
    _id = sha1(_tmp.join(':'));
    _data['_id'] = _id;
  }


  //
  // 下面是处理数据的方法
  //

  //
  // 添加新的记录
  //
  if(_p.method === 'add'){

    // 保持数据的唯一性
    let record = db(_p.db).chain()
                          .find({_id:_data['_id']})
                          .value();
    console.log('added:',record);

    if(!record){
      db(_p.db).push(_data);
      client.publish(`/local/db/pub/list/${_p.db}`,JSON.stringify(db(_p.db)));
    }

    return 0;
  }

  //
  // 删除记录
  //
  if(_p.method === "remove"){

    db(_p.db).remove({_id:_data['_id']});

    client.publish(`/local/db/pub/list/${_p.db}`,JSON.stringify(db(_p.db)));

  }

  //
  // 选取所有的记录
  //
  if(_p.method === 'list'){

    console.log('list');
    let records = db(_p.db);

    client.publish(`/local/db/pub/list/${_p.db}`,JSON.stringify(records));

    return 0;

  }

})
