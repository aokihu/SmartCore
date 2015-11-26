'use strict';
// 引用模块
var fs = require("fs");
var Spawn = require("child_process").spawn;
var events = require('events');
var util = require('util');


class MusicPlayer{

  construct(){
    console.log("MusicPlayer Ready...");
  }

  playPlaylist(){
    console.log("Play Playlist");
  }


}

module.exports = MusicPlayer;
