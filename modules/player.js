// Player.js
// 音乐播放控制模块
var FS = require("fs");
var Exec = require('child_process').exec;
var Spawn = require("child_process").spawn;
var events = require('events');
var util = require('util');

//
// 播放停止标志，当STOP_FLAF == 2 的时候说明播放停止
var STOP_FLAG = 0;

var Player = function(param){

		// @property 预存的音乐路径, 如果有设置这个属性, 则自动搜索该路径下的文件
		self.path =  (param && param.path) ? param.path : null;

		// @property 当前状态
		// @enum 	idle 		空闲
		// 			playing 	正在播放
		// 			pause 		暂停
		//
		self.status = "idle";

		self._stopFlag = 0;


		// 开启mplayer进程
		self.mplayer = Spawn('/usr/bin/mplayer', ['-quiet' ,'-idle', '-slave', '--ac=mad,', '-softvol', '-input', 'file=/tmp/mplayer'], 
								{detached: true, stdio: ['ignore', 'pipe', 'ignore']});

		self.mplayer.stdout.on('data', function(data){
			var _data = data.toString();

			if(list = _data.match(/Cannot sync MAD frame/ig))
			{
				STOP_FLAG++;

				if (STOP_FLAG == 2) {
					STOP_FLAG = 0;
					self.emit('stop');
				};
			}

			self.emit('data', _data);
			_data = null;
		})

		self.mplayer.unref();

		// 设置初始化硬件音量
		Exec("amixer -c 0 sset 'Master',0 "+self.CURRENT_H_VOLUME+"%");
	}

	util.inherits(Player, events.EventEmitter);

	var self = Player.prototype;


	// 全局变量定义
	self.CURRENT_S_VOLUME	= 80;	// 当前软件音量
	self.CURRENT_H_VOLUME	= 80;	// 当前硬件音量
	self.STEP_ADJUST_Volume	= 5;	// 音量调节步进
	self.CURRENT_MUSIC_INDEX = 0;	// 当前播放音乐的序号


	// @function 检查文件有效性
	//
	self._checkfile = function(){

	}

	// @function 合成音乐路径
	// @param filename 音乐文件名字
	// @param[option] path 音乐文件路径，如果_m.path已经设置，那么就可以不用
	self._makeFullFilename = function(filename, path){

		if(path)
			return [path,filename].join('/');
		else if(self.path)
			return [self.path,filename].join('/');
		else
			throw 'not set path';
	}

	//
	// @function 发送控制信息给mplayer
	// @param cmd 控制命令
	//
	self._send = function(cmd)
	{
		// FS.writeFileSync('/tmp/mplayer', cmd + "\n");
		var echo = "echo '" + cmd + "' > /tmp/mplayer";
		console.log(echo);
		var child = Exec(echo, function(err, stdout, stderr){
			console.log('stdout: ' + stdout);
		    console.log('stderr: ' + stderr);

			if (err != null) {
				console.log("Child_Process Error:", err);
			};
		});

	}


	// @function 播放音乐
	// @param type= file | url 播放文件类型,file是音乐文件,url是网络资源
	// @param file= ... 如果type是文件则输入文件绝对路径名称,如果是url则输入网络资源
	// @param path= ... 播放音乐的文件夹路径，不要有'/'
	self.play = function(param){

		var filename = param.filename || '';
		var type = param.type || 'file';
		var path = param.path || null;

		var cmd  = 'loadfile';
		var url  = "";

		console.log('file',filename);

		// 进行文件类型的判断
		if(type == "file")
		{
			try
			{
				url = self._makeFullFilename(filename, path);
			}
			catch(err)
			{
				// 文件解析错误
				self.emit("error", self, err);
			}

		}
		else if(type == 'url')
		{
			url = param.file;
		}

		self._send([cmd, url].join(' '));

		// 清理
		filename = type = path = cmd = url = null;
	}

	/**
	 * 播放播放列表音乐
	 * @param  {object} param.filename 播放列表名称
	 */
	self.playPlaylist = function(param)
	{
		var filename = param.filename || '';
		var type = param.type || 'file';
		var path = param.path || null;

		var cmd  = 'loadlist';
		var url  = "";

		url = self._makeFullFilename(filename, path);

		self._send([cmd, url].join(' '));

		// clear
		filename = type = path = cmd = url = null;
	}

	//
	// @function 停止播放音乐
	//
	self.stop = function(){

		self._send("stop");
	}

	//
	// @function 暂停播放音乐
	//
	self.pause = function(){
		self._send("pause");
	}

	//
	// @function 增加音量
	//
	self.volumeUp = function(){
		self._send("volume 1");
	}

	//
	// @function 增加硬件音量
	//
	self.volumeHWUp= function(){
		// 判断当前音量设置是否超标
		self.CURRENT_H_VOLUME =
		self.CURRENT_H_VOLUME + self.STEP_ADJUST_Volume > 100 ?
		100 :
		self.CURRENT_H_VOLUME + self.STEP_ADJUST_Volume;

		Exec("amixer -c 0 sset 'Master',0 "+self.CURRENT_H_VOLUME+"%");
	}

	//
	// @function 减少音量
	//
	self.volumeDown = function(){
		self._send("volume -1");
	}

	//
	// @function 减少硬件音量
	//
	self.volumeHWDown = function(){
		// 判断当前音量设置是否超标
		self.CURRENT_H_VOLUME =
		self.CURRENT_H_VOLUME - self.STEP_ADJUST_Volume < 0 ?
		0 :
		self.CURRENT_H_VOLUME - self.STEP_ADJUST_Volume;

		Exec("amixer -c 0 sset 'Master',0 "+self.CURRENT_H_VOLUME+"%");
	}


module.exports = Player;
