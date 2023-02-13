
const prometheus = require('prom-client');

const requestCounter = new prometheus.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'page']
});

const jobWaitingHistogram = new prometheus.Histogram({
    name: 'job_waiting_duration_histrogram',
    help: 'Amount of time taken to precess the job',
    buckets: [0.1, 5, 15, 50, 100, 500],
    labelNames: ['job_id', 'group_id', 'service_id', 'company_id', 'entry_time', 'start_time', 'end_time']
});

const jobWaitingSummary = new prometheus.Summary({
    name: 'job_waiting_duration_summary',
    help: 'Amount of time taken to precess the job',
    labelNames: ['job_id', 'group_id', 'service_id', 'company_id', 'entry_time', 'start_time', 'end_time'],
    percentiles: [0.01, 0.1, 0.9, 0.99],
    maxAgeSeconds: 600,
    ageBuckets: 5,
});


const jobWaitingGauge = new prometheus.Gauge({
    name: 'job_waiting_duration_gauge',
    help: 'Amount of time taken to precess the job',
    labelNames: ['job_id', 'group_id', 'service_id', 'company_id', 'entry_time', 'start_time', 'end_time']
});

const jobCompleteGauge = new prometheus.Gauge({
    name: 'job_complete_duration_gauge',
    help: 'Amount of time taken to precess the job',
    labelNames: ['job_id', 'group_id', 'service_id', 'company_id', 'entry_time', 'start_time', 'end_time']
});

exports.prometheus = prometheus;
exports.requestCounter = requestCounter;
exports.jobWaitingHistogram = jobWaitingHistogram;
exports.jobWaitingSummary = jobWaitingSummary;

exports.jobWaitingGauge = jobWaitingGauge;
exports.jobCompleteGauge = jobCompleteGauge;