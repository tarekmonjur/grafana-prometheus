const { Queue, QueueEvents } = require('bullmq');
const { jobWaitingGauge, jobCompleteGauge } = require('./prometheus');

const redisConnection = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS
};

class BullMQueue {
    constructor(queueName = 'myService') {
        this.myQueue = new Queue(queueName, { connection: redisConnection });
        this.queueEvent = new QueueEvents(queueName, { connection: redisConnection });            

        this.onWaiting();
        this.onActive();
        this.onCompleted();
    }

    async addQueue(jobName, jobData) {
        jobData.entry_time = new Date().getTime();
        const job = await this.myQueue.add(jobName, jobData, { delay: 3000, removeOnComplete: 5000, removeOnFail: 5000 });
    }

    async addJobs(jobName, companys) {
        for (const key in companys) {
            const jobData = {
                action: 'inbound',
                service_id: 1,
                company_id: companys[key],
                entry_time: null,
                start_time: null,
                end_time: null,
            };
            await this.addQueue(jobName, jobData);
        }
    }

    onWaiting() {
        this.queueEvent.on('waiting', ({jobId, prev}) => {
            console.log('waiting', jobId);
        });
    }

    onActive() {
        this.queueEvent.on('active', async({jobId, prev}) => {
            console.log('active', jobId, prev);
            const job = await this.myQueue.getJob(jobId);
            const jobData = job?.data;
            if (!jobData?.start_time) {
                console.log('set start time');
                jobData.start_time = new Date().getTime();
                const duration = jobData.start_time -  jobData.entry_time;
                jobWaitingGauge.set({
                    job_id: job.id,
                    company_id: jobData.company_id,
                    group_id: `${jobData.service_id}-${jobData.company_id}`,
                    service_id: jobData.service_id,
                    entry_time: jobData.entry_time,
                    start_time: jobData.start_time,
                    end_time: null,
                }, duration);
                job.update(jobData);
            }
        });
    }

    onCompleted() {
        this.queueEvent.on('completed', async ({jobId, prev}) => {
            console.log('completed', jobId, prev);
            const job = await this.myQueue.getJob(jobId);
            const jobData = job?.data;
            if (!jobData?.end_time) {
                console.log('set end time');
                jobData.end_time = new Date().getTime();
                const duration = jobData.end_time - jobData.entry_time;
                jobCompleteGauge.set({
                    job_id: job.id,
                    company_id: jobData.company_id,
                    group_id: `${jobData.service_id}-${jobData.company_id}`,
                    service_id: jobData.service_id,
                    entry_time: jobData.entry_time,
                    start_time: jobData.start_time,
                    end_time: jobData.end_time,
                }, duration);
                job.update(jobData);
            }
        });
    }

    onFailed() {
        this.queueEvent.on('failed', ({jobId, failedReason, prev}) => {
            console.log('failed', jobId, failedReason);
        });
    }

}

module.exports = BullMQueue;