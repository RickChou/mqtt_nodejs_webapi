const express = require('express');
const path = require('path');
const app = express();
// ==================== MQTT 橋接（新增這段）===================
const mqtt = require('mqtt');

// 直接用 WebSocket + TLS 連你的 HiveMQ Cloud
const mqttClient = mqtt.connect('wss://c15f9e95fc2e43a8bc949b3b4849d189.s1.eu.hivemq.cloud:8884/mqtt', {
  username: 'aaeonshm487',
  password: 'Aaeonm487',
  rejectUnauthorized: true   // 安全驗證
});

mqttClient.on('connect', () => {
  console.log('MQTT Bridge 已連線 HiveMQ Cloud');
});

mqttClient.on('error', (err) => {
  console.error('MQTT 連線錯誤:', err);
});
// ============================================================
// 你原本的 API（保留，舊 LTE 程式還是能用）
app.get('/rgb', (req, res) => {
  const { r, g, b } = req.query;
  console.log('舊版 /rgb 收到顏色:', req.query);

  // 轉發成 MQTT
  if (r && g && b) {
    mqttClient.publish('home/light/color', `${r},${g},${b}`);
    mqttClient.publish('home/light/brightness', '100');  // 舊版沒亮度，預設全亮
  }
  res.send('OK');
});

app.get('/off', (req, res) => {
  console.log('舊版 /off 關燈');
  mqttClient.publish('device_recv', 'close relay');
  res.send('OFF');
});

// ==================== 新增推薦的乾淨 API（給新 LTE 程式用）====================
// 開燈
app.get('/api/light/on', (req, res) => {
  mqttClient.publish('device_recv', 'open relay');
  res.send('Light ON');
});

// 關燈
app.get('/api/light/off', (req, res) => {
  mqttClient.publish('device_recv', 'close relay');
  res.send('Light OFF');
});

// 設定顏色 + 亮度（最推薦使用這個）
app.get('/api/light/color', (req, res) => {
  const r = parseInt(req.query.r);
  const g = parseInt(req.query.g);
  const b = parseInt(req.query.b);
  const v = req.query.v ? parseInt(req.query.v) : 100;  // 預設 100%

  if (![r, g, b].some(isNaN)) {
    mqttClient.publish('home/light/color', `${r},${g},${b}`);
    mqttClient.publish('home/light/brightness', String(v));
    res.send(`Color: ${r},${g},${b} 亮度: ${v}%`);
  } else {
    res.status(400).send('錯誤：需要 r,g,b 參數（0-255）');
  }
});

// 靜態檔案
app.use(express.static(__dirname));

// 所有其他路由導向 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Railway 會給 PORT
app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on PORT:', process.env.PORT || 3000);
});
