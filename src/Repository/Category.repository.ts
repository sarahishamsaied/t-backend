import { EnumStatus, PrismaClient, Category, Task } from '@prisma/client';

class CategoryRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getByUserId(userId: string): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: { userId },
    });
    return categories;
  }

  async getTasksByCategoryId(categoryId: string, userId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        categoryIds: {
          has: categoryId,
        },
      },
    });
    return tasks;
  }

  async create(category: Omit<Category, 'id' | 'createdAt' | 'isDeleted' | 'deletedAt'>): Promise<Category> {
    console.log('Creating category');
    const created = await this.prisma.category.create({ data: category });
    return created;
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    return category;
  }

  async update(id: string, category: Partial<Category>): Promise<Category> {
    const updatedCategory = await this.prisma.category.update({ where: { id }, data: category });
    return updatedCategory;
  }

  async delete(id: string): Promise<Category> {
    const category = await this.prisma.category.update({ where: { id }, data: { deletedAt: new Date(), isDeleted: true } });
    return category;
  }

  async index({
    userId,
    page = 1,
    limit = 10,
    filters,
  }: {
    userId: string;
    page?: number;
    limit: number;
    filters: Record<string, any>;
  }): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: { userId, isDeleted: false, ...filters },
      take: limit,
      skip: (page - 1) * limit,
    });
    return categories;
  }
}

export default CategoryRepository;
