const express = require('express');
const { prometheus, requestCounter } = require('./prometheus');
const report = require('./report');
const app = express();

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

app.use('/waiting', report);

app.listen(process.env.PORT, () => {
    console.log(`Server listening on http://localhost:${process.env.PORT}`);
});
