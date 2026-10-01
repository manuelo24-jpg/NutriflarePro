import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoutineDto, UpdateRoutineDto } from './dto/routines.dto';

@Injectable()
export class RoutinesService {
  constructor(private prisma: PrismaService) {}

  async findUserRoutines(userId: string) {
    return this.prisma.routine.findMany({
      where: { userId },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const routine = await this.prisma.routine.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!routine) {
      throw new NotFoundException('Routine not found');
    }

    return routine;
  }

  async create(userId: string, dto: CreateRoutineDto) {
    return this.prisma.routine.create({
      data: {
        name: dto.name,
        description: dto.description,
        dayOfWeek: dto.dayOfWeek,
        isPublic: dto.isPublic ?? false,
        userId,
        exercises: {
          create: dto.exercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            restSeconds: ex.restSeconds ?? 60,
            order: ex.order,
          })),
        },
      },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateRoutineDto) {
    const routine = await this.prisma.routine.findUnique({ where: { id } });
    if (!routine) throw new NotFoundException('Routine not found');
    if (routine.userId !== userId) throw new ForbiddenException('Not authorized');

    // Delete existing exercises and recreate
    await this.prisma.routineExercise.deleteMany({ where: { routineId: id } });

    return this.prisma.routine.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        dayOfWeek: dto.dayOfWeek,
        isPublic: dto.isPublic ?? false,
        exercises: {
          create: dto.exercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            restSeconds: ex.restSeconds ?? 60,
            order: ex.order,
          })),
        },
      },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async remove(userId: string, id: string) {
    const routine = await this.prisma.routine.findUnique({ where: { id } });
    if (!routine) throw new NotFoundException('Routine not found');
    if (routine.userId !== userId) throw new ForbiddenException('Not authorized');

    await this.prisma.routine.delete({ where: { id } });
    return { message: 'Routine deleted successfully' };
  }
}
