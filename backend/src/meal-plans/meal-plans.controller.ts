import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { MealPlansService } from './meal-plans.service';
import { CreateMealPlanDto, UpdateMealPlanDto } from './dto/meal-plans.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('meal-plans')
export class MealPlansController {
  constructor(private readonly mealPlansService: MealPlansService) {}

  @Get()
  findUserMealPlans(@Req() req: any) {
    return this.mealPlansService.findUserMealPlans(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mealPlansService.findOne(id);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateMealPlanDto) {
    return this.mealPlansService.create(req.user.id, dto);
  }

  @Put(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateMealPlanDto) {
    return this.mealPlansService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.mealPlansService.remove(req.user.id, id);
  }
}
