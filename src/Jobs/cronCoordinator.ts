import { changeStatus } from './changeStatus';
import cron from 'node-cron';

const scheduleJobs = (): void => {
  console.log('Cron job started');
  cron.schedule('*/15 * * * *', async () => {
    await changeStatus();
  });
};

export default scheduleJobs;
