const express = require('express');
const { prometheus, requestCounter } = require('./prometheus');
const report = require('./report');
const BullWorker = require('./worker');
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

app.get('/add_queue', async(req, res) => {
    const BullMQ = require('./queue');
    const queue = new BullMQ('autotask');
    try{
        const companyIds = req.query.company_ids.split(',');
        let repeats = Number(req.query.repeat);
        if (repeats) {
            while(repeats) {
                await queue.addJobs('inbound', companyIds);
                repeats--;
            }
        } else {
            await queue.addJobs('inbound', companyIds);
        }
        res.end('ok');
    } catch (err) {
        res.send(err.message);
    }
});

app.use('/report', report);


app.listen(process.env.PORT, () => {
    console.log(`Server listening on http://localhost:${process.env.PORT}`);
    new BullWorker('autotask');
});
