import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDishDto, QueryDishDto } from './dto/dishes.dto';
import { ContentStatus } from '@prisma/client';

@Injectable()
export class DishesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryDishDto) {
    const where: any = {
      OR: [
        { isDefault: true },
        { status: ContentStatus.APPROVED },
      ],
    };

    if (query.mealType) {
      where.mealType = query.mealType;
    }

    if (query.search) {
      where.name = { contains: query.search, mode: 'insensitive' };
    }

    return this.prisma.dish.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const dish = await this.prisma.dish.findUnique({
      where: { id },
    });
    if (!dish) {
      throw new NotFoundException('Dish not found');
    }
    return dish;
  }

  async create(userId: string, dto: CreateDishDto) {
    return this.prisma.dish.create({
      data: {
        name: dto.name,
        description: dto.description,
        calories: dto.calories,
        protein: dto.protein,
        carbs: dto.carbs,
        fat: dto.fat,
        mealType: dto.mealType,
        imageUrl: dto.imageUrl,
        submittedById: userId,
        status: ContentStatus.APPROVED,
      },
    });
  }
}
