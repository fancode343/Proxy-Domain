const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const port = 80;

// Proxy configuration
app.use('/', createProxyMiddleware({
    target: 'de.vpsfree.es:5093',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        // Modify the request here if needed
    },
    onProxyRes: (proxyRes, req, res) => {
        // Modify the response here if needed
    }
}));

// Start the server
app.listen(port, () => {
    console.log(`Proxy server listening on port ${port}`);
});
