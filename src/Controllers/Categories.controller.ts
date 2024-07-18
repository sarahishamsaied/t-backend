import { Request, Response } from 'express';
import CategoryRepository from '../Repository/Category.repository';
import { CustomRequest } from '../middlewares/verifyAccessToken';
import prisma from '../config/prismaClient';
import { CustomError } from '../Errors/CustomError';

export const create = async (req: Request, res: Response) => {
  const { name } = req.body;
  const userId = (req as CustomRequest).userId as string;
  if (!userId) {
    throw new CustomError('User not found', 400);
  }
  const categoryRepository = new CategoryRepository(prisma);
  const category = await categoryRepository.create({ name, userId });
  console.log('success');
  res.json(category);
};

export const findById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const categoryRepository = new CategoryRepository(prisma);
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw new CustomError('Category not found', 400);
  }
  const userId = (req as CustomRequest).userId;
  if (category.userId !== userId) {
    throw new CustomError('You do not have permission to access this category', 401);
  }
  res.json(category);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const userId = (req as CustomRequest).userId;
  const categoryRepository = new CategoryRepository(prisma);
  const foundCategory = await categoryRepository.findById(id);
  if (!foundCategory) {
    throw new CustomError('Category not found', 400);
  }
  if (foundCategory.userId !== userId) {
    throw new CustomError('You do not have permission to update this category', 401);
  }
  const category = await categoryRepository.update(id, { name, userId });
  res.json(category);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  const categoryRepository = new CategoryRepository(prisma);
  const userId = (req as CustomRequest).userId;
  const foundCategory = await categoryRepository.findById(id);
  if (!foundCategory) {
    throw new CustomError('Category not found', 400);
  }
  if (foundCategory.userId !== userId) {
    throw new CustomError('You do not have permission to delete this category', 401);
  }
  const category = await categoryRepository.delete(id);
  res.json(category);
};

export const getTasksByCategoryId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const categoryRepository = new CategoryRepository(prisma);
  const userId = (req as CustomRequest).userId;

  const tasks = await categoryRepository.getTasksByCategoryId(id, userId as string);
  res.json(tasks);
};

export const get = async (req: Request, res: Response) => {
  const categoryRepository = new CategoryRepository(prisma);
  const { page = 1, limit = 10, ...filters } = req.query;
  const categories = await categoryRepository.index({
    userId: (req as CustomRequest).userId as string,
    page: Number(page),
    limit: Number(limit),
    filters,
  });
  res.json(categories);
};
