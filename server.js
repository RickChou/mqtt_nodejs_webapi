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
// API
app.get('/rgb', (req, res) => {
  console.log('收到顏色:', req.query);
  res.send('OK');
});

app.get('/off', (req, res) => {
  console.log('關燈');
  res.send('OFF');
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
