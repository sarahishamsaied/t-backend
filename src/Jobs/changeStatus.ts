import cron from 'node-cron';
import TaskRepository from '../Repository/Task.repository';
import prisma from '../config/prismaClient';

export const changeStatus = async (): Promise<void> => {
  const taskRepository = new TaskRepository(prisma);
  await taskRepository.changeTaskStatus();
};
