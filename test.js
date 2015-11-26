'use strict';
var mqtt = require('mqtt'),
    Setting = require('./setting.json')

var client = mqtt.connect(Setting[Setting.Mode].mqtt_server);

client.on('connect', () => {
  client.publish('/local/music/play/playlist')
})
