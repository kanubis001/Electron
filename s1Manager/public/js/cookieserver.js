const http = require('http');

const server = http.createServer((req, res) => {
    res.setHeader('Set-Cookie', 'mycookie=value');
    const cookies = req.headers.cookie;
});