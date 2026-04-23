const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const { readConfig, writeConfig, checkConfigComplete } = require('./server/configManager');
const { generateFidoInitJWT, verifyJWT, parseJWTResponse } = require('./server/jwtManager');

// 创建Express应用
const app = express();

// 配置中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 路由
app.get('/api/config', (req, res) => {
  try {
    const config = readConfig();
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/config', (req, res) => {
  try {
    const config = req.body;
    writeConfig(config);
    res.json({ success: true, message: '配置保存成功' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  try {
    const isComplete = checkConfigComplete();
    res.json({ success: true, configComplete: isComplete });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/jwt/generate', (req, res) => {
  try {
    const config = readConfig();
    const result = generateFidoInitJWT(config);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/jwt/verify', (req, res) => {
  try {
    const { jws } = req.body;
    const config = readConfig();
    const decoded = verifyJWT(jws, config.JWT_SECRET);
    const parsed = parseJWTResponse(decoded);
    res.json({ success: true, data: parsed });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/callback', (req, res) => {
  try {
    const { JWT } = req.query;
    if (!JWT) {
      return res.status(400).send('Missing JWT parameter');
    }
    
    const config = readConfig();
    const decoded = verifyJWT(JWT, config.JWT_SECRET);
    const parsed = parseJWTResponse(decoded);
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Callback</title>
      </head>
      <body>
        <script>
          window.parent.postMessage({ type: 'JWT_RESPONSE', data: ${JSON.stringify(parsed)}, jws: '${JWT}' }, '*');
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`Callback error: ${error.message}`);
  }
});

app.get('/ddc-callback', (req, res) => {
  try {
    const { JWT } = req.query;
    if (!JWT) {
      return res.status(400).send('Missing JWT parameter');
    }
    
    const config = readConfig();
    const decoded = verifyJWT(JWT, config.JWT_SECRET);
    const payload = decoded.payload;
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>DDC Callback</title>
      </head>
      <body>
        <script>
          window.parent.postMessage({ type: 'DDC_RESPONSE', payload: ${JSON.stringify(payload)} }, '*');
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`DDC callback error: ${error.message}`);
  }
});

app.post('/ddc-callback', (req, res) => {
  try {
    const { JWT } = req.body;
    if (!JWT) {
      return res.status(400).send('Missing JWT parameter');
    }
    
    const config = readConfig();
    const decoded = verifyJWT(JWT, config.JWT_SECRET);
    const payload = decoded.payload;
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>DDC Callback</title>
      </head>
      <body>
        <script>
          window.parent.postMessage({ type: 'DDC_RESPONSE', payload: ${JSON.stringify(payload)} }, '*');
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`DDC callback error: ${error.message}`);
  }
});

// 404处理
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 配置HTTPS证书
const options = {
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem'))
};

// 启动服务器
const PORT = 8443;
https.createServer(options, app).listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});