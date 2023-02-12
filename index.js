const express = require('express');
const prometheus = require('prom-client');

const app = express();

const requestCounter = new prometheus.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'page']
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', prometheus.register.contentType);
    console.log(await prometheus.register.metrics());
    res.send(await prometheus.register.metrics());
});

app.get('/home', (req, res) => {
    requestCounter.inc({ method: req.method, page: 'home' });
    res.sendFile(__dirname+'/home.html');
});

app.get('/', (req, res) => {
    requestCounter.inc({ method: req.method, page: 'index' });
    res.sendFile(__dirname+'/index.html');
});

app.listen(process.env.PORT, () => {
    console.log(`Server listening on http://localhost:${process.env.PORT}`);
});
