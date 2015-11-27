'use strict';
var events = require("events"),
    util = require("util"),
    _ = require('lodash');

/**
 * 定时服务
 * @description 指定的时间执行特定程序
 *
 * 时间格式(这里只针对一周的时间进行设定, *代表任意)
 * {
 * 	dw:{ // 周天
 * 			h:{ // 小时
 * 					m:[  // 分钟
 * 							{action, data} 执行操作, 附加数据
 * 					]
 * 				}
 * 			}
 * }
 *
 * 保存的数据格式
 * [
 * 	{
 * 		id:uuid,
 * 		wd:[0~6],
 * 		h:[0~23],
 * 		m:[0~59],
 * 		s:[0~59],
 * 		action:string,
 * 		data:string|object,
 * 		comment:string
 * 	},
 * 	...
 * ]
 */

// var TimerService = function(){

//   // 保存本地指针
//   var self = this;
//
//   self.schedule = {
//     0:{},
//     1:{},
//     2:{},
//     3:{},
//     4:{},
//     5:{20:{20:{0:[{action:"play playlist",data:"/home/orangepi/p.m3u"}]}}},
//     6:{}
//   };
//   self.nextTimeoutDuration = 0; /* 下一次定时器启动间隔时间，单位ms */
//
//   /**
//    * 加载时刻表的内容
//    * @return {[type]} [description]
//    */
//   self.loadSchedule = function(scheduleFile){
//
//     // 检查文件是否存在
//
//   }
//
//   /**
//    * 每秒自动计算定时触发条件
//    */
//   setInterval(function(){
//
//     var now = new Date();
//
//     var dw = self.schedule[now.getDay()];
//
//     if(dw){
//
//       var h = dw[now.getHours()];
//
//       if(h){
//
//         var m = h[now.getMinutes()];
//
//         if(m){
//
//           s = m[now.getSeconds()];
//
//           if(s && s.length > 0){
//
//             for(i = 0; i < s.length ; i++){
//               self.emit('timeout', s[i]);
//             }
//
//           }
//
//         }
//
//       }
//
//     }
//
//   },1000)
//
// }
//
// // 继承events
// util.inherits(TimerService, events.EventEmitter);

class Timer extends events.EventEmitter {


  /**
   * 构造方法
   * @return {[type]} [description]
   */
  construct(){
    this.schedule = [];
  }

  /**
   * 查找下一个定时器
   */
  findNextTimer(){

    let now = new Date();
    let dw  = now.getDay(),
        h   = now.getHours(),
        m   = now.getMinutes(),
        s   = now.getSeconds();

    let next = null;

    // 如果时刻表的长度是0，那么终止寻找
    if(this.schedule.length == 0)
      return next;

    // 查找今天的时刻表中是否有任务
    // 如果没有任务,那么往后一天查找
    next = {dw:dw};
    do{

      this.schedule.forEach((item)=>{
        if(item.dw == next.dw){
          
        }
      });

      // 往后推迟一天
      next.dw++;
      if(next.dw == 7)
        next.dw = 0; // 回归到0

    }while(dw == next.dw)

  }

}

module.exports = Timer;
