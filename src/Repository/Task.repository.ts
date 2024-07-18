import { EnumStatus, PrismaClient, Task } from '@prisma/client';

class TaskRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async get({
    userId,
    page = 1,
    limit = 0,
    filters,
  }: {
    userId: string;
    page?: number;
    limit: number;
    filters: Record<string, any>;
  }): Promise<Task[]> {
    const skip = (page - 1) * limit;
    const tasks = await this.prisma.task.findMany({ where: { userId, isDeleted: false, ...filters }, take: limit, skip });
    return tasks;
  }

  async create(task: Omit<Task, 'id' | 'createdAt' | 'isDeleted' | 'deletedAt'>): Promise<Task> {
    console.log('Creating task');
    const created = await this.prisma.task.create({ data: task });
    return created;
  }

  async findById(id: string): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    return task;
  }

  async update(id: string, task: Partial<Task>): Promise<Task> {
    const updatedTask = await this.prisma.task.update({ where: { id }, data: task });
    return updatedTask;
  }

  async updateStatus(id: string, status: EnumStatus): Promise<Task> {
    const task = await this.prisma.task.update({ where: { id }, data: { status } });
    return task;
  }

  async delete(id: string): Promise<Task> {
    const task = await this.prisma.task.update({ where: { id }, data: { deletedAt: new Date(), isDeleted: true } });
    return task;
  }

  async changeTaskStatus(): Promise<string> {
    console.log('Updating task status');
    const currentTime = new Date();
    const tasksToUpdate = await this.prisma.task.findMany({
      where: {
        AND: [{ startDate: { lte: currentTime } }, { endDate: { gte: currentTime } }],
      },
    });
    tasksToUpdate.forEach(async (task) => {
      console.log('Updating task status to IN_PROGRESS');
      await this.prisma.task.update({ where: { id: task.id }, data: { status: EnumStatus.IN_PROGRESS } });
    });
    console.log('Task status updated');
    return 'Task status updated';
  }
}

export default TaskRepository;
