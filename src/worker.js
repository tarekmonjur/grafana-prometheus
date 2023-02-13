const { Worker } = require('bullmq');

module.exports = class BullWorker {
    constructor(queueName) {
        this.worker = new Worker(queueName, this.workerJobProcess, {
            connection: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                password: process.env.REDIS_PASS
        }});
    }

    async workerJobProcess(job) {
        console.log('worker job process', job.data);
    }
}