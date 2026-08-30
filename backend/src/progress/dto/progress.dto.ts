import { IsNumber, IsOptional, IsString, IsDateString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProgressLogDto {
  @IsDateString()
  date!: string;

  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(300)
  weightKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(70)
  bodyFatPct?: number;

  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(200)
  muscleMassKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(250)
  chestCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(250)
  waistCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(250)
  hipCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(100)
  armCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(150)
  thighCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(24)
  sleepHours?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  waterLiters?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100000)
  dailySteps?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20000)
  caloriesBurned?: number;

  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(220)
  restingHeartRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(60)
  @Max(250)
  systolicBp?: number;

  @IsOptional()
  @IsNumber()
  @Min(40)
  @Max(150)
  diastolicBp?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  energyLevel?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  stressLevel?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class SetProgressGoalDto {
  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(300)
  weightKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(70)
  bodyFatPct?: number;

  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(200)
  muscleMassKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(250)
  chestCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(250)
  waistCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(250)
  hipCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(100)
  armCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(150)
  thighCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(24)
  sleepHours?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  waterLiters?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100000)
  dailySteps?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20000)
  caloriesBurned?: number;
}
