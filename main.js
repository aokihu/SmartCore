'use strict';

/**
 * 负责启动各项服务
 */

const {spawn} = require('child_process');
const fs = require('fs');
const Console = console.Console;

const servicesPath = process.cwd() + "/services";

//
// 读取所有的服务
//
 var files = fs.readdirSync(servicesPath);
var services = files.filter((item) => {return item.endsWith('.js')})
services.forEach((srv)=>{
  let _srv = spawn('node',[`${servicesPath}/${srv}`],{stdio:'inherit'});
})
