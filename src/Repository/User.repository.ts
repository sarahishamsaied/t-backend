import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { CustomError } from '../Errors/CustomError';

const UserResponseDTO = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  dateOfBirth: true,
  isVerified: true,
  createdAt: true,
  deletedAt: true,
  isDeleted: true,
};

class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'deletedAt' | 'isDeleted'>): Promise<Omit<User, 'password'>> {
    const userExists = await this.findByEmail(user.email);
    if (userExists) {
      throw new CustomError('User already exists', 400);
    }
    user.dateOfBirth = new Date(user.dateOfBirth);
    user.password = bcrypt.hashSync(user.password, 10);
    const created = await this.prisma.user.create({ data: user });
    const { password, ...userWithoutPassword } = created;
    return userWithoutPassword;
  }

  async login(email: string, password: string): Promise<{ token: string } | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new CustomError('Invalid email or password', 400);
    }
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      throw new CustomError('Invalid email or password', 400);
    }

    const token = sign(
      { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, isDeleted: user.isDeleted },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '30d' },
    );
    return { token };
  }

  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = this.prisma.user.findUnique({
      where: { id },
      select: UserResponseDTO,
    });
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    return user;
  }

  async findByEmail(email: string): Promise<Omit<User, 'password'> | null> {
    const user = this.prisma.user.findFirst({
      where: { email },
      select: UserResponseDTO,
    });
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    return user;
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const foundUser = this.prisma.user.update({ where: { id }, data: user });
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    return foundUser;
  }

  async delete(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isDeleted: true },
      select: UserResponseDTO,
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }
    return user;
  }

  async reactivate(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { deletedAt: null, isDeleted: false },
      select: UserResponseDTO,
    });
    if (!user.isDeleted) {
      throw new CustomError('User account is already active', 400);
    }
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    return user;
  }
}

export default UserRepository;
