const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const http = require('http');
const https = require('https');

const app = express();
const port = 8080;
const targetUrl = 'http://grok.com';

// Function to check if the target URL is online
function checkTargetOnline(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const options = {
      method: 'HEAD',
      host: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
    };
    
    const req = (urlObj.protocol === 'https:' ? https : http).request(options, (res) => {
      resolve(res.statusCode < 400);
    });

    req.on('error', () => resolve(false));
    req.end();
  });
}

// Middleware to log each request
app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  next();
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to check if the target URL is online before proxying
app.use('/', async (req, res, next) => {
  const isOnline = await checkTargetOnline(targetUrl);
  if (isOnline) {
    createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to: ${proxyReq.path}`);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`Received response from: ${proxyRes.req.path}`);
      },
      onError: (err, req, res) => {
        console.error(`Error during proxying: ${err.message}`);
        res.sendFile(path.join(__dirname, 'public', 'error.html'));
      }
    })(req, res, next);
  } else {
    console.error(`${targetUrl} is offline. Serving error page.`);
    res.sendFile(path.join(__dirname, 'public', 'error.html'));
  }
});

// Fallback route to serve index.html for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'errr.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
