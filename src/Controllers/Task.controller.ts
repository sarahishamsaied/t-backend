import { Request, Response } from 'express';
import TaskRepository from '../Repository/Task.repository';
import { CustomRequest } from '../middlewares/verifyAccessToken';
import prisma from '../config/prismaClient';
import { CustomError } from '../Errors/CustomError';

export const get = async (req: Request, res: Response) => {
  const userId = (req as CustomRequest).userId;
  console.log('user id is', userId);
  const taskRepository = new TaskRepository(prisma);
  const { page = 1, limit = 10, ...filters } = req.query;
  const tasks = await taskRepository.get({ userId: userId as string, page: Number(page), limit: Number(limit), filters });
  res.json(tasks);
};

export const create = async (req: Request, res: Response) => {
  const { title, content, status, startDate, endDate, priority, tags, categoryIds } = req.body;
  const userId = (req as CustomRequest).userId as string;
  if (!userId) {
    throw new CustomError('User not found', 400);
  }
  const taskRepository = new TaskRepository(prisma);
  const task = await taskRepository.create({ title, content, userId, startDate, endDate, status, priority, tags, categoryIds });
  console.log('success');
  res.json(task);
};

export const findById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const taskRepository = new TaskRepository(prisma);
  const task = await taskRepository.findById(id);
  if (!task) {
    throw new CustomError('Task not found', 400);
  }
  const userId = (req as CustomRequest).userId;
  if (task.userId !== userId) {
    throw new CustomError('You do not have permission to access this task', 401);
  }
  res.json(task);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, status, startDate, endDate, priority, tags } = req.body;
  const userId = (req as CustomRequest).userId;
  const taskRepository = new TaskRepository(prisma);
  const foundTask = await taskRepository.findById(id);
  if (!foundTask) {
    throw new CustomError('Task not found', 400);
  }
  if (foundTask.userId !== userId) {
    throw new CustomError('You do not have permission to update this task', 401);
  }
  const task = await taskRepository.update(id, { title, content, userId, startDate, endDate, status, priority, tags });
  res.json(task);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  const taskRepository = new TaskRepository(prisma);
  const userId = (req as CustomRequest).userId;
  const foundTask = await taskRepository.findById(id);
  if (!foundTask) {
    throw new CustomError('Task not found', 400);
  }
  if (foundTask.userId !== userId) {
    throw new CustomError('You do not have permission to delete this task', 401);
  }
  const task = await taskRepository.delete(id);
  res.json(task);
};

export const updateStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const taskRepository = new TaskRepository(prisma);
  const userId = (req as CustomRequest).userId;
  const foundTask = await taskRepository.findById(id);
  if (!foundTask) {
    throw new CustomError('Task not found', 400);
  }
  if (foundTask.userId !== userId) {
    throw new CustomError('You do not have permission to update this task', 401);
  }
  const task = await taskRepository.updateStatus(id, status);
  console.log('success');
  res.json(task);
};
