import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseDto, QueryExerciseDto } from './dto/exercises.dto';
import { ContentStatus } from '@prisma/client';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryExerciseDto) {
    const where: any = {
      OR: [
        { isDefault: true },
        { status: ContentStatus.APPROVED },
      ],
    };

    if (query.muscleGroup) {
      where.muscleGroup = query.muscleGroup;
    }

    if (query.search) {
      where.name = { contains: query.search, mode: 'insensitive' };
    }

    return this.prisma.exercise.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
    });
    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }
    return exercise;
  }

  async create(userId: string, dto: CreateExerciseDto) {
    return this.prisma.exercise.create({
      data: {
        name: dto.name,
        description: dto.description,
        muscleGroup: dto.muscleGroup,
        difficulty: dto.difficulty ?? 1,
        videoUrl: dto.videoUrl,
        imageUrl: dto.imageUrl,
        submittedById: userId,
        status: ContentStatus.APPROVED, // Auto-approve for demo
      },
    });
  }
}
