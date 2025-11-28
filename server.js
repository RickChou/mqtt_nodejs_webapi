const express = require('express');
const path = require('path');
const app = express();

// 伺服靜態檔案
app.use(express.static(__dirname));

// 處理所有路由都回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 接收顏色
app.get('/rgb', (req, res) => {
  console.log('收到顏色:', req.query);
  // 這裡之後可以轉發給 ESP32、MQTT、WebSocket…
  res.send('OK');
});

app.get('/off', (req, res) => {
  console.log('關燈');
  res.send('OFF');
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on PORT:", process.env.PORT || 3000);
});
