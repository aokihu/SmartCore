'use strict';

/**
 * 负责启动各项服务
 */

const spawn = require('child_process').spawn;
const fs = require('fs');
const Console = console.Console;

const servicesPath = process.cwd() + "/services";

var srvDir = fs.readdirSync(servicesPath);
srvDir = srvDir.filter((item) => {item.startsWith(".")})
console.log(srvDir);

//
// 处理命令参数
// 指定启动的服务,参数不用添加*Service.js,只需要添加前面的服务名称便可
//
let __services__ = new Set();
let argv = process.argv.splice(2);
argv.forEach( arg => __services__.add(arg) );

//
// 检查服务是否有效
// 如果没有设置服务那么默认开启所有服务
//
if(__services__.size == 0){

}
else {

}
