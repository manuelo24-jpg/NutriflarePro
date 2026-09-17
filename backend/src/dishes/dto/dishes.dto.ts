import { IsString, IsOptional, IsEnum, IsInt, IsNumber, Min, IsUrl } from 'class-validator';
import { MealType } from '@prisma/client';

export class CreateDishDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  calories?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  protein?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  carbs?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fat?: number;

  @IsEnum(MealType)
  mealType!: MealType;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}

export class QueryDishDto {
  @IsOptional()
  @IsEnum(MealType)
  mealType?: MealType;

  @IsOptional()
  @IsString()
  search?: string;
}
