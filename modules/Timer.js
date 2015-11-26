var events = require("events"),
    util = require("util");

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
 */

var TimerService = function(){

  // 保存本地指针
  var self = this;

  self.schedule = {
    0:{},
    1:{11:{37:{0:[{"action":"play single","data":"playlist.m3u"}]}}, 12:{16:{5:[{"action":"play playlist","data":null}]}}},
    2:{},
    3:{},
    4:{},
    5:{},
    6:{}
  };
  self.nextTimeoutDuration = 0; /* 下一次定时器启动间隔时间，单位ms */

  /**
   * 加载时刻表的内容
   * @return {[type]} [description]
   */
  self.loadSchedule = function(){

  }

  /**
   * 每秒自动计算定时触发条件
   */
  setInterval(function(){

    var now = new Date();

    var dw = self.schedule[now.getDay()];

    if(dw){

      var h = dw[now.getHours()];

      if(h){

        var m = h[now.getMinutes()];

        if(m){

          s = m[now.getSeconds()];

          if(s && s.length > 0){

            for(i = 0; i < s.length ; i++){
              self.emit('timeout', s[i]);
            }

          }

        }

      }

    }

  },1000)

}

// 继承events
util.inherits(TimerService, events.EventEmitter);

module.exports = TimerService;
