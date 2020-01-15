import Bee from 'bee-queue';
import WellcomeMail from '../app/jobs/WellcomeMail';
import AnswerMail from '../app/jobs/AnswerMail';
import redisConfig from '../config/redis';

const jobs = [WellcomeMail, AnswerMail];
class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig
        }),
        handle
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.process(handle);
    });
  }
}

export default new Queue();
