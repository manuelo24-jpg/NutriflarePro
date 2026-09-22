import { IsString, IsOptional, IsEnum, IsBoolean, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { DayOfWeek, MealType } from '@prisma/client';

export class MealPlanItemDto {
  @IsString()
  dishId!: string;

  @IsEnum(MealType)
  mealType!: MealType;

  @IsNumber()
  @Min(0.1)
  quantity!: number;
}

export class CreateMealPlanDto {
  @IsString()
  name!: string;

  @IsEnum(DayOfWeek)
  dayOfWeek!: DayOfWeek;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealPlanItemDto)
  items!: MealPlanItemDto[];
}

export class UpdateMealPlanDto extends CreateMealPlanDto {}
