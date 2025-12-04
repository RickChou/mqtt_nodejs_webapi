const express = require('express');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');

const app = express();
const port = 3000;

// 解析 JSON body
app.use(bodyParser.json());

// MQTT 連線設定
const mqttClient = mqtt.connect('wss://c15f9e95fc2e43a8bc949b3b4849d189.s1.eu.hivemq.cloud:8884/mqtt', {
  username: 'aaeonshm487',
  password: 'Aaeonm487'
});

mqttClient.on('connect', () => {
  console.log('MQTT 連線成功！');
});

mqttClient.on('error', (err) => {
  console.error('MQTT 連線失敗：', err);
});

// HTTP API
// 開燈
app.post('/api/on', (req, res) => {
  mqttClient.publish('device_recv', 'open relay');
  res.json({ status: 'ok', action: 'on' });
});

// 關燈
app.post('/api/off', (req, res) => {
  mqttClient.publish('device_recv', 'close relay');
  res.json({ status: 'ok', action: 'off' });
});

// 設定顏色
app.post('/api/color', (req, res) => {
  const { r, g, b } = req.body;
  if (r === undefined || g === undefined || b === undefined) {
    return res.status(400).json({ error: '請提供 r, g, b' });
  }

  mqttClient.publish('home/light/color', `${r},${g},${b}`);
  res.json({ status: 'ok', color: { r, g, b } });
});

// 設定亮度 (0~100)
app.post('/api/brightness', (req, res) => {
  const { value } = req.body;
  if (value === undefined || value < 0 || value > 100) {
    return res.status(400).json({ error: 'value 需在 0~100' });
  }

  mqttClient.publish('home/light/brightness', String(value));
  res.json({ status: 'ok', brightness: value });
});

app.listen(port, () => {
  console.log(`HTTP API 服務已啟動，埠號 ${port}`);
});
