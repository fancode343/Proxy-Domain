const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const port = 8080;

// Middleware to log each request
app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
});

// Proxy configuration
app.use('/', createProxyMiddleware({
    target: 'http://de.vpsfree.es:5093',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        // Optional: Modify the request here if needed
        console.log(`Proxying request to: ${proxyReq.path}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        // Optional: Modify the response here if needed
        console.log(`Received response from: ${proxyRes.req.path}`);
    },
    onError: (err, req, res) => {
        // Handle errors here
        console.error(`Error occurred while proxying: ${err.message}`);
        res.status(500).send('Something went wrong.');
    }
}));


// Start the server
app.listen(port, () => {
    console.log(`Proxy server listening on port ${port}`);
});
