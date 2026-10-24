import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContentStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isBlocked: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async blockUser(id: string, isBlocked: boolean) {
    return this.prisma.user.update({
      where: { id },
      data: { isBlocked },
      select: { id: true, email: true, isBlocked: true }
    });
  }

  async getPendingContent() {
    const pendingExercises = await this.prisma.exercise.findMany({
      where: { status: 'PENDING' },
      include: { submittedBy: { select: { username: true, email: true } } }
    });
    const pendingDishes = await this.prisma.dish.findMany({
      where: { status: 'PENDING' },
      include: { submittedBy: { select: { username: true, email: true } } }
    });
    return { exercises: pendingExercises, dishes: pendingDishes };
  }

  async updateContentStatus(type: 'exercise' | 'dish', id: string, status: ContentStatus) {
    if (type === 'exercise') {
      const exercise = await this.prisma.exercise.findUnique({ where: { id } });
      if (!exercise) throw new NotFoundException('Exercise not found');
      return this.prisma.exercise.update({ where: { id }, data: { status } });
    } else {
      const dish = await this.prisma.dish.findUnique({ where: { id } });
      if (!dish) throw new NotFoundException('Dish not found');
      return this.prisma.dish.update({ where: { id }, data: { status } });
    }
  }
}
