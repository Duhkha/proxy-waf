const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');

const app = express();

// Logging requests
app.use(morgan('dev'));

// Middleware to block certain requests based on custom logic
app.use((req, res, next) => {
    const authToken = req.headers['x-auth-token'];
    if (authToken != 'skibidi') {
      console.log(`Blocked access from IP ${req.ip} due to missing or invalid token`);
      return res.status(403).send('Access Denied: No valid authentication token provided.');
    }
    next();
  });
  

// Proxy requests to your actual server
app.use(
  '/',
  createProxyMiddleware({
    target: 'http://localhost:3000', // URL of your actual server
    changeOrigin: true,
  })
);

// Start the reverse proxy server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Reverse proxy running on port ${PORT}`);
});
