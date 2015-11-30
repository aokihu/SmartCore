'use strict';
var events = require("events"),
    util = require("util"),
    fs = require('fs'),
    later = require('later'),
    _ = require('lodash');

class Timer extends events.EventEmitter{

  constructor(){
    super();

    this.timers = [];
    this.schedule = null;

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

  }

  /**
   * 移除一个定时任务
   * @param  {UUID} taskId [description]
   * @return {[type]}        [description]
   */
  remove(taskId){

  }

  get schedule(){
    return this.schedule;
  }

}

module.exports = Timer;
