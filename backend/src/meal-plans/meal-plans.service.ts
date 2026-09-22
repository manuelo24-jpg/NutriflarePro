import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMealPlanDto, UpdateMealPlanDto } from './dto/meal-plans.dto';

@Injectable()
export class MealPlansService {
  constructor(private prisma: PrismaService) {}

  private calculateMacros(items: any[]) {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    items.forEach((item) => {
      const q = item.quantity ?? 1;
      const d = item.dish;
      if (d) {
        calories += (d.calories ?? 0) * q;
        protein += (d.protein ?? 0) * q;
        carbs += (d.carbs ?? 0) * q;
        fat += (d.fat ?? 0) * q;
      }
    });

    return {
      calories: Math.round(calories),
      protein: Number(protein.toFixed(1)),
      carbs: Number(carbs.toFixed(1)),
      fat: Number(fat.toFixed(1)),
    };
  }

  async findUserMealPlans(userId: string) {
    const plans = await this.prisma.mealPlan.findMany({
      where: { userId },
      include: {
        items: {
          include: { dish: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return plans.map((plan) => ({
      ...plan,
      totalMacros: this.calculateMacros(plan.items),
    }));
  }

  async findOne(id: string) {
    const plan = await this.prisma.mealPlan.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
        items: {
          include: { dish: true },
        },
      },
    });

    if (!plan) {
      throw new NotFoundException('Meal plan not found');
    }

    return {
      ...plan,
      totalMacros: this.calculateMacros(plan.items),
    };
  }

  async create(userId: string, dto: CreateMealPlanDto) {
    const created = await this.prisma.mealPlan.create({
      data: {
        name: dto.name,
        dayOfWeek: dto.dayOfWeek,
        isPublic: dto.isPublic ?? false,
        userId,
        items: {
          create: dto.items.map((item) => ({
            dishId: item.dishId,
            mealType: item.mealType,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: { dish: true },
        },
      },
    });

    return {
      ...created,
      totalMacros: this.calculateMacros(created.items),
    };
  }

  async update(userId: string, id: string, dto: UpdateMealPlanDto) {
    const plan = await this.prisma.mealPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Meal plan not found');
    if (plan.userId !== userId) throw new ForbiddenException('Not authorized');

    await this.prisma.mealPlanItem.deleteMany({ where: { mealPlanId: id } });

    const updated = await this.prisma.mealPlan.update({
      where: { id },
      data: {
        name: dto.name,
        dayOfWeek: dto.dayOfWeek,
        isPublic: dto.isPublic ?? false,
        items: {
          create: dto.items.map((item) => ({
            dishId: item.dishId,
            mealType: item.mealType,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: { dish: true },
        },
      },
    });

    return {
      ...updated,
      totalMacros: this.calculateMacros(updated.items),
    };
  }

  async remove(userId: string, id: string) {
    const plan = await this.prisma.mealPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Meal plan not found');
    if (plan.userId !== userId) throw new ForbiddenException('Not authorized');

    await this.prisma.mealPlan.delete({ where: { id } });
    return { message: 'Meal plan deleted successfully' };
  }
}
