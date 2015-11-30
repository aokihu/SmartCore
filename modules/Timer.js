'use strict';
var events = require("events"),
    util = require("util"),
    fs = require('fs'),
    later = require('later'),
    UUID = require('uuid'),
    _ = require('lodash');

class Timer extends events.EventEmitter{

  constructor(){
    super();

    this.timers = [];
    this.schedule = [];

  }

  /**
   * 加载时刻表数据
   * @return {[type]} [description]
   */
  load(dataFile){

    this.dataFile = dataFile;

    try{

      let rawData = fs.readFileSync(this.dataFile, 'utf8');

      this.schedule = JSON.parse(rawData);

    }
    catch(e){
      console.error("Can not find schedule data file!");
    }

  }

  /**
   * 开始启动计时器
   */
  start(){

    later.date.localTime();
    this.schedule.forEach(task => {

      // 构造later的时间表
      let schde = {
        schedules:[
          {h:[task.h], m:[task.m]}
        ],
        exceptions:[]
      };

      let t = later.setInterval(()=>{
        console.log("Timeout")
        this.emit('timeout',{action:task.action, data:task.data})
      }, schde);

      this.timers.push(t);

    })
  }

  /**
   * 停止计时器
   */
  stop(){

    this.timers.forEach(timer => {
      timer.clear();
    })

  }

  /**
   * 添加一个定时任务
   * @param {object} task 定时任务
   */
  add(task){

    let _task = {
      id:UUID.v4(),
      wd:[],
      h:0,
      m:0,
      s:0,
      action:"",
      data:"",
      comment:""
    }

    _.assign(_task, task);

    this.schedule.push(_task);

  }

  /**
   * 移除一个定时任务
   * @param  {UUID} taskId [description]
   * @return {[type]}        [description]
   */
  remove(taskId){

    let pos = this.schedule.findeIndex((task) => {
      return task.id === taskID
    });

    if(pos > -1){
      this.schedule.splice(pos, 1);
    }

  }

  /**
   * 保存数据
   * @return {[type]} [description]
   */
  save(){

    // 1. 检查数据文件是否存在
    // 2. 如果没有，那么就保存到当前app根目录下
    let jsonData = JSON.stringify(this.schedule);

    fs.writeFile(this.dataFile, jsonData, (err) => {
      if (err) throw err;
      console.error(err);
    });

  }

  get schedule(){
    return this.schedule;
  }

}

module.exports = Timer;
