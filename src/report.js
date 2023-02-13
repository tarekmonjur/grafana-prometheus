const {requestCounter, jobWaitingHistogram, jobWaitingSummary, jobWaitingGauge} = require('./prometheus');
const express = require('express');
const router = express.Router();

const sleep = async() => new Promise(resolve => setTimeout(resolve, 1000));
const randomNumber = (range = 9) => Math.floor(Math.random() * range);

router.get('/company', async (req, res) => {

    requestCounter.inc({ method: req.method, page: 'reports' });

    // jobWaitingHistogram.labels({job_id: randomNumber(), company_id: 2});
    // jobWaitingHistogram.observe(randomNumber());

    // jobWaitingSummary.labels({job_id: randomNumber(), company_id: 2});
    // jobWaitingSummary.observe(randomNumber());

    jobWaitingGauge.set({
        job_id: randomNumber(5),
        company_id: randomNumber(3),
        group_id: randomNumber(2),
        service_id: randomNumber(2),
        entry_time: 0,
        start_time: 0,
        end_time: 0,
    }, randomNumber());
    await sleep();
    jobWaitingGauge.set({
        job_id: randomNumber(5),
        company_id: randomNumber(3),
        group_id: randomNumber(2),
        service_id: randomNumber(2),
        entry_time: 0,
        start_time: 0,
        end_time: 0,
    }, randomNumber());
    await sleep();
    jobWaitingGauge.set({
        job_id: randomNumber(5),
        company_id: randomNumber(3),
        group_id: randomNumber(2),
        service_id: randomNumber(2),
        entry_time: 0,
        start_time: 0,
        end_time: 0,
    }, randomNumber());
    
    res.end('ok');
});

module.exports = router;