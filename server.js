const express = require('express');
const path = require('path');
const app = express();

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
